const FUSO_HORARIO = "America/Sao_Paulo";

const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: FUSO_HORARIO,
});

const formatadorHora = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: FUSO_HORARIO,
});

export function formatarDataAtualizacao(data: Date): string {
  if (Number.isNaN(data.getTime())) return "";

  return `${formatadorData.format(data)} às ${formatadorHora.format(data)}`;
}