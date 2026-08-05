import Link from "next/link";
import { PATHS } from "@/constants/brand";

export default function FormPrivacyNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-zinc-600 text-xs leading-relaxed ${className}`}>
      Нажимая кнопку, вы соглашаетесь с{" "}
      <Link
        href={PATHS.privacy}
        className="text-zinc-500 underline underline-offset-2 hover:text-zinc-300 transition-colors"
      >
        политикой конфиденциальности
      </Link>
      . Данные передаются в Telegram для обработки заявки.
    </p>
  );
}
