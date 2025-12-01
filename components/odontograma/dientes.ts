import MolarAction from "./Actions/Molar-actions";
import PremolarAction from "./Actions/Premolar-actions";
import CaninoAction from "./Actions/Canino-actions";
import CaninoActiond from "./Actions/Canino-actions-d";
import IncisivoAction from "./Actions/Incisivo-actions";

export interface ToothComponentProps {
  toothId: string;
  onZoneSelect: (zone: string) => void;
  zoneColors: Record<string, string>;
  disabled?: boolean;
  borderColor?: string;
}

export const ActionsTypeMap: Record<string, React.FC<ToothComponentProps>> = {
  molar: MolarAction,
  premolar: PremolarAction,
  canino: CaninoAction,
  caninod: CaninoActiond,
  incisivo: IncisivoAction,
};

export function getToothType(toothId: string): string {
  if (
    [
      "16",
      "17",
      "18",
      "26",
      "27",
      "28",
      "36",
      "37",
      "38",
      "46",
      "47",
      "48",
      // Temporales (Molares)
      "54", "55", "64", "65", "74", "75", "84", "85"
    ].includes(toothId)
  )
    return "molar";
  if (["15", "25", "34", "35", "44", "45"].includes(toothId)) return "premolar";
  if (["14"].includes(toothId)) return "canino";
  if (["24"].includes(toothId)) return "caninod";
  if (
    [
      "11",
      "12",
      "13",
      "21",
      "22",
      "23",
      "31",
      "32",
      "33",
      "41",
      "42",
      "43",
      // Temporales (Incisivos)
      "53", "51", "52", "61", "62", "63", "71", "72", "73", "81", "82", "83", "84"
    ].includes(toothId)
  )
    return "incisivo";
  return "molar";
}
