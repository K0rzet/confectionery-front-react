import React from "react";
import equipmentImg from "@/assets/images/Equipment.png";
import fireExtinguisherImg from "@/assets/images/FireExtinguisher.png";
import firstAidImg from "@/assets/images/FirstAid.png";
import exitImg from "@/assets/images/Exit.jpg";

const EquipmentIcon: React.FC = () => (
  <img src={equipmentImg} alt="Оборудование" width="24" height="24" />
);
const FireExtinguisherIcon: React.FC = () => (
  <img src={fireExtinguisherImg} alt="Огнетушитель" width="24" height="24" />
);
const FirstAidIcon: React.FC = () => (
  <img src={firstAidImg} alt="Аптечка" width="24" height="24" />
);
const ExitIcon: React.FC = () => (
  <img src={exitImg} alt="Выход" width="24" height="24" />
);

export const MarkerIcons = {
  OBORUDOVANIE: EquipmentIcon,
  OGNETUSHITEL: FireExtinguisherIcon,
  APTECHKA: FirstAidIcon,
  VYKHOD: ExitIcon,
} as const;
