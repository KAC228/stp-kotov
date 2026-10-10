import { CONTACTS } from "../constants/brand";
import { cardById, FOREMAN_CARDS, type ForemanCard, type ForemanSource } from "../data/foreman-cards";

export type ForemanReply = {
  cardId: string | null;
  title: string;
  action: string;
  detail: string;
  source: ForemanSource;
  related: Array<{ id: string; title: string; ask: string }>;
  confident: boolean;
};

const PRODUCT_FIT: ForemanSource = {
  label: "Комплектация СТП-КОТОВ",
  note: "Какое сечение физически садится на эту высоту камеры. Норматив сечение не назначает — его берут из проекта, а на камеру ставят только допустимую врезку.",
};

const HEIGHTS = [85, 105, 110, 125, 145, 155, 160, 185, 225] as const;
type Height = (typeof HEIGHTS)[number];

const DIAMETERS = [75, 90, 110, 125, 160, 200] as const;
type Diameter = (typeof DIAMETERS)[number];

const LENGTHS = [500, 1000, 1500, 2000] as const;

const FLEX_BY_HEIGHT: Record<Height, Diameter[]> = {
  85: [],
  105: [75],
  110: [75, 90],
  125: [75, 90],
  145: [75, 90, 110],
  155: [75, 90, 110, 125],
  160: [75, 90, 110, 125, 160],
  185: [75, 90, 110, 125, 160],
  225: [75, 90, 110, 125, 160, 200],
};

const MIN_HEIGHT: Record<Diameter, Height> = {
  75: 105,
  90: 110,
  110: 145,
  125: 155,
  160: 160,
  200: 225,
};

const AMBIGUOUS = new Set<number>([110, 160]);

const STOP = new Set([
  "как", "что", "где", "это", "при", "для", "или", "под", "над", "уже", "еще", "ещё",
  "можно", "нужно", "надо", "если", "чем", "кто", "все", "всё", "про", "без", "так",
  "вот", "там", "тут", "его", "ее", "её", "их", "по", "на", "из", "от", "до", "за",
  "об", "со", "то", "мы", "вы", "он", "она", "они", "мой", "наш", "ваш", "этот",
  "эта", "эти", "только", "когда", "чтобы", "чтоб", "будет", "быть", "был", "была",
  "были", "есть", "мне", "нам", "вас", "меня", "ли", "же", "бы", "не", "ни", "да",
  "нет", "или", "при", "уже", "просто", "очень", "какая", "какой", "какие", "какое",
  "камеру", "камера", "ксд",
]);

export const QUICK_QUESTIONS: Array<{ label: string; query: string }> = [
  { label: "Высота 105", query: "Какой воздуховод на высоту КСД 105 мм" },
  { label: "Ø 125 на 145", query: "Влезет ли гибкий диаметр 125 на высоту 145" },
  { label: "Натяжной или ГКЛ", query: "Натяжной потолок или ГКЛ какую камеру ставить" },
  { label: "Разметка щели", query: "Как отметить место теневого диффузора" },
  { label: "Крепёж трубы", query: "Какой шаг крепежа гибкого воздуховода" },
  { label: "Заслонка", query: "Как настроить дроссельную заслонку" },
  { label: "Гарантия", query: "Сохраняется ли гарантия если монтируем сами" },
  { label: "Стена и огонь", query: "Можно ли резать отверстие в противопожарной стене под воздуховод" },
];

function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/(\d)\s*[xх×*]\s*(\d)/gi, "$1x$2")
    .replace(/\s+/g, " ")
    .trim();
}

function isHeight(n: number): n is Height {
  return (HEIGHTS as readonly number[]).includes(n);
}

function isDiameter(n: number): n is Diameter {
  return (DIAMETERS as readonly number[]).includes(n);
}

function heightList(h: Height): string {
  const flex = FLEX_BY_HEIGHT[h];
  const rigid = "прямоугольные 204×60 и 100×60, овал 132×32";
  if (flex.length === 0) return `${rigid}. Гибких врезок нет.`;
  const diameters = flex.map((d) => `Ø ${d}`).join(", ");
  return `${rigid} и гибкие ${diameters}.`;
}

function relatedFrom(ids: string[]): ForemanReply["related"] {
  return ids
    .map((id) => cardById(id))
    .filter((card): card is ForemanCard => Boolean(card))
    .map((card) => ({ id: card.id, title: card.title, ask: card.ask }));
}

function reply(partial: Omit<ForemanReply, "related"> & { related?: ForemanReply["related"] }): ForemanReply {
  return { related: partial.related ?? [], ...partial };
}

function fitReply(title: string, action: string, detail: string): ForemanReply {
  return reply({
    cardId: "fit",
    title,
    action,
    detail,
    source: PRODUCT_FIT,
    related: relatedFrom(["before-start", "flex-run", "duct-fastening"]),
    confident: true,
  });
}

type Role = "height" | "diameter" | "length" | "section";

function roleFromContext(query: string, num: number, index: number): Role | "ambiguous" | null {
  const before = query.slice(Math.max(0, index - 36), index);
  const after = query.slice(index, Math.min(query.length, index + String(num).length + 16));
  const around = `${before} ${after}`;

  if (/204x60|100x60|132x32/.test(query) && (num === 204 || num === 100 || num === 132 || num === 60 || num === 32)) {
    return "section";
  }
  if (/(длин|пилить|подрез|укорот)/.test(around) && (LENGTHS as readonly number[]).includes(num)) return "length";
  if (/(диаметр|гибк|гофр|\bdn\b|ø|d\s)/.test(around) && (isDiameter(num) || AMBIGUOUS.has(num))) return "diameter";
  if (/(высот|запотолок)/.test(around) && (isHeight(num) || AMBIGUOUS.has(num))) return "height";
  if ((LENGTHS as readonly number[]).includes(num) && /(длин|мм|камер)/.test(query)) return "length";
  if (isHeight(num) && isDiameter(num)) return "ambiguous";
  if (isHeight(num)) return "height";
  if (isDiameter(num)) return "diameter";
  if ((LENGTHS as readonly number[]).includes(num)) return "length";
  return null;
}

function interpretProduct(query: string): ForemanReply | null {
  const mentions: Array<{ num: number; role: Role | "ambiguous"; index: number }> = [];
  for (const match of query.matchAll(/\d+/g)) {
    const num = Number(match[0]);
    const index = match.index ?? 0;
    const role = roleFromContext(query, num, index);
    if (role) mentions.push({ num, role, index });
  }

  const wantsFit = /(воздуховод|врезк|диаметр|высот|сечен|влез|подойд|гибк|гофр|овал|прямоуг|ксд|камер)/.test(query);
  const section = query.match(/204x60|100x60|132x32/)?.[0] ?? null;

  if (!wantsFit && !section && !mentions.some((m) => m.role === "length" || m.role === "height" || m.role === "diameter")) {
    return null;
  }

  const heights = mentions.filter((m) => m.role === "height" && isHeight(m.num));
  const diameters = mentions.filter((m) => m.role === "diameter" && isDiameter(m.num));
  const ambiguous = mentions.filter((m) => m.role === "ambiguous");
  const lengths = mentions.filter((m) => m.role === "length");

  if (ambiguous.length > 0 && heights.length === 0 && diameters.length === 0) {
    const n = ambiguous[0].num;
    if (n === 110 || n === 160) {
      const asHeight = n as Height;
      const asDiameter = n as Diameter;
      return fitReply(
        `${n} мм — высота или диаметр`,
        `Если это высота КСД, на неё ставят: ${heightList(asHeight)} Если это гибкий диаметр Ø ${n}, камера нужна от ${MIN_HEIGHT[asDiameter]} мм.`,
        "На площадке лучше сказать «высота камеры» или «диаметр трубы», чтобы не перепутать два разных размера.",
      );
    }
  }

  const height = heights[0]?.num;
  const diameter = diameters[0]?.num;

  if (section && isHeight(height ?? NaN)) {
    const h = height as Height;
    return fitReply(
      `${section.replace("x", "×")} на высоте ${h} мм`,
      `Да. Сечение ${section.replace("x", "×")} садится на любую высоту ряда, включая ${h} мм.`,
      `На ${h} мм кроме него доступно: ${heightList(h)}`,
    );
  }

  if (section && height === undefined && diameter === undefined) {
    return fitReply(
      `Сечение ${section.replace("x", "×")}`,
      `Сечение ${section.replace("x", "×")} садится на любую высоту КСД в ряду: ${HEIGHTS.join(", ")} мм.`,
      "Гибкий диаметр от высоты зависит. Прямоугольные 60 мм и овал 132×32 — нет.",
    );
  }

  if (isHeight(height ?? NaN) && isDiameter(diameter ?? NaN)) {
    const h = height as Height;
    const d = diameter as Diameter;
    const ok = FLEX_BY_HEIGHT[h].includes(d);
    if (ok) {
      return fitReply(
        `Ø ${d} на высоте ${h} мм`,
        `Да. Гибкий Ø ${d} на КСД высотой ${h} мм в комплектации есть.`,
        `Полный набор на ${h} мм: ${heightList(h)}`,
      );
    }
    return fitReply(
      `Ø ${d} на высоте ${h} мм не встаёт`,
      `Гибкий Ø ${d} на высоту ${h} мм не ставят. Нужна камера от ${MIN_HEIGHT[d]} мм.`,
      `На ${h} мм можно: ${heightList(h)} Корпус под больший диаметр не рассверливают.`,
    );
  }

  if (isHeight(height ?? NaN) && diameter === undefined) {
    const h = height as Height;
    const blocked = DIAMETERS.find((d) => !FLEX_BY_HEIGHT[h].includes(d));
    const limit = blocked
      ? `Ø ${blocked} и крупнее на эту высоту не ставят.`
      : "Это максимальная высота ряда, на неё садится и Ø 200.";
    return fitReply(
      `Высота КСД ${h} мм`,
      `На высоту ${h} мм ставят: ${heightList(h)}`,
      `${limit} Если запотолочье ниже камеры — корпус не плющат, меняют высоту в заказе.`,
    );
  }

  if (isDiameter(diameter ?? NaN) && height === undefined) {
    const d = diameter as Diameter;
    return fitReply(
      `Гибкий Ø ${d}`,
      `Гибкий Ø ${d} встаёт на КСД высотой от ${MIN_HEIGHT[d]} мм.`,
      `Ниже этой высоты берите прямоугольные 204×60 или 100×60, либо овал 132×32 — они есть на всём ряду.`,
    );
  }

  if (/(высот|запотолок)/.test(query) && !section && diameter === undefined) {
    const odd = [...query.matchAll(/\d+/g)]
      .map((match) => Number(match[0]))
      .find((n) => n >= 40 && n <= 400 && !isHeight(n) && !isDiameter(n) && !(LENGTHS as readonly number[]).includes(n));
    if (odd !== undefined) {
      return fitReply(
        `Высоты ${odd} мм в ряду нет`,
        `Такой высоты КСД нет. Ряд: ${HEIGHTS.join(", ")} мм.`,
        "Ближайшую камеру в проём не плющат и не наращивают. Заказывают ту высоту, которая проходит в запотолочье и принимает нужное сечение.",
      );
    }
  }

  if (/(диаметр|гибк|гофр)/.test(query)) {
    const unknownDiameter = query.match(/(?:диаметр|dn|ø)\s*(\d+)/);
    if (unknownDiameter && !isDiameter(Number(unknownDiameter[1]))) {
      const n = Number(unknownDiameter[1]);
      return fitReply(
        `Диаметра ${n} мм в комплектации нет`,
        `Гибкие диаметры КСД: ${DIAMETERS.join(", ")} мм.`,
        "Переходник «почти тот же диаметр» на объекте не ставят, если его нет в заказе.",
      );
    }
  }

  if (lengths.length > 0 && /(длин|пилить|подрез|укорот|метр)/.test(query)) {
    return reply({
      cardId: "custom-length",
      title: "Длина камеры",
      action: `Камеру под проём не пилят. В ряду ${LENGTHS.join(", ")} мм. Тип потолка и врезка не меняют состав заказа без согласования.`,
      detail: "Другая длина — отдельный заказ на производство, не рез на объекте.",
      source: PRODUCT_FIT,
      related: relatedFrom(["custom-length", "mark-diffuser"]),
      confident: true,
    });
  }

  return null;
}

function stem(token: string): string {
  return token.replace(/(ами|ями|ого|ему|ыми|ими|ах|ях|ов|ев|ом|ем|ой|ый|ий|ая|ое|ые|ие|ать|ять|ить|еть|а|я|ы|и|о|е|у|ю)$/u, "");
}

function tokensOf(query: string): string[] {
  return query
    .split(/[^a-zа-я0-9]+/iu)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOP.has(token));
}

function keywordHits(query: string, keyword: string): boolean {
  const needle = normalize(keyword);
  if (needle.length < 3) return false;
  if (query.includes(needle)) return true;
  return needle.split(" ").every((word) => {
    if (word.length < 3) return query.includes(word);
    if (query.includes(word)) return true;
    const stemmed = stem(word);
    return stemmed.length >= 4 && query.includes(stemmed);
  });
}

function scoreCard(query: string, tokens: string[], card: ForemanCard): number {
  const hay = normalize(`${card.title} ${card.keywords.join(" ")} ${card.action}`);
  let score = 0;
  for (const keyword of card.keywords) {
    if (!keywordHits(query, keyword)) continue;
    score += keyword.includes(" ") ? 10 : 6;
  }
  if (keywordHits(query, card.title)) score += 8;
  for (const token of tokens) {
    if (hay.includes(token)) {
      score += token.length >= 6 ? 3 : 2;
      continue;
    }
    const stemmed = stem(token);
    if (stemmed.length >= 4 && hay.includes(stemmed)) score += 1;
  }
  return score;
}

function matchCards(query: string): ForemanReply {
  const tokens = tokensOf(query);
  const ranked = FOREMAN_CARDS
    .map((card) => ({ card, score: scoreCard(query, tokens, card) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const second = ranked[1];
  const confident = Boolean(
    best && (best.score >= 8 || (best.score >= 6 && best.score >= (second?.score ?? 0) + 3)),
  );

  const related = ranked
    .filter((row) => row.card.id !== best?.card.id && row.score > 0)
    .slice(0, 3)
    .map((row) => ({ id: row.card.id, title: row.card.title, ask: row.card.ask }));

  if (!confident || !best) {
    return reply({
      cardId: null,
      title: "В базе нет прямого ответа",
      action: `Этот узел не делайте наугад. Остановитесь и сверьте с проектом или позвоните: ${CONTACTS.phoneDisplay}.`,
      detail:
        "Спросите про высоту камеры, диаметр, тип потолка, крепёж трубы, заслонку, гарантию или проход через противопожарную стену. Полных текстов СП и ГОСТ в базе нет — в ответе номер документа и действие на месте.",
      source: {
        label: "База прораба СТП-КОТОВ",
        note: "Если подходящей карточки нет, решение принимает инженер, а не поиск по базе.",
      },
      related,
      confident: false,
    });
  }

  return reply({
    cardId: best.card.id,
    title: best.card.title,
    action: best.card.action,
    detail: best.card.detail,
    source: best.card.source,
    related,
    confident: true,
  });
}

function intro(): ForemanReply {
  return reply({
    cardId: null,
    title: "Спросите узел",
    action: "Напишите, что перед вами: высота камеры, диаметр трубы, натяжной или ГКЛ, крепёж, заслонка, гарантия, проход через стену.",
    detail: `Голосом тоже можно. Если ответа нет — звоните ${CONTACTS.phoneDisplay}, узел не закрывайте.`,
    source: {
      label: "База прораба СТП-КОТОВ",
      note: "Правила монтажа КСД и карточки по СП 60.13330.2020, СП 73.13330.2016, СП 7.13130.2013. Полные тексты норм сюда не входят.",
    },
    related: relatedFrom(["before-start", "ceiling-type", "norms"]),
    confident: true,
  });
}

export function answerForeman(raw: string): ForemanReply {
  const query = normalize(raw);
  if (!query || /^(привет|здравствуйте|здравствуй|добрый день|добрый|hello|hi|помощь|что умеешь)$/.test(query)) {
    return intro();
  }
  return interpretProduct(query) ?? matchCards(query);
}
