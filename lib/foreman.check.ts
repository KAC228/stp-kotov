import assert from "node:assert/strict";
import { answerForeman } from "./foreman";

function includes(query: string, needle: string): void {
  const reply = answerForeman(query);
  const blob = `${reply.title} ${reply.action} ${reply.detail}`.toLowerCase();
  assert.ok(reply.confident, `expected confident: ${query} → ${reply.title}`);
  assert.ok(blob.includes(needle.toLowerCase()), `${query} → missing «${needle}» in «${reply.action}»`);
}

includes("Какой воздуховод на высоту КСД 105 мм", "ø 75");
includes("Какой воздуховод на высоту КСД 105 мм", "ø 90 и крупнее");
includes("Влезет ли гибкий диаметр 125 на высоту 145", "не ставят");
includes("Влезет ли гибкий диаметр 125 на высоту 155", "есть");
includes("Как отметить место теневого диффузора", "шаблон");
includes("Сохраняется ли гарантия если монтируем сами", "снимает");
includes("Можно ли резать отверстие в противопожарной стене под воздуховод", "сп 7.13130.2013");
includes("Какой СНиП или ГОСТ смотреть на вентиляцию", "сп 60.13330.2020");
includes("высота камеры 120", "в ряду нет");
includes("гибкий диаметр 80", "нет");
includes("овал 132x32 на высоту 85", "да");
includes("204x60 на высоту 85", "да");
includes("Какой шаг крепежа гибкого воздуховода", "метр");

const vague = answerForeman("покрась забор в синий");
assert.equal(vague.confident, false);

const hello = answerForeman("привет");
assert.equal(hello.confident, true);

console.log("foreman checks ok");
