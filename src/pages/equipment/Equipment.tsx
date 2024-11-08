import React from "react";
import { useQuery } from "@tanstack/react-query";
import equipmentService from "@/services/equipments/equipment.service";
import { IEquipment } from "@/types/equipment.types";

export function EquipmentPage() {
  const { data: equipment, isLoading, error } = useQuery<IEquipment[]>({
    queryKey: ["equipment"],
    queryFn: () => equipmentService.getEquipment({}),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div>
      <h1>Equipment</h1>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Маркировка</th>
            <th>Тип оборудования</th>
            <th>Характеристики</th>
          </tr>
        </thead>
        <tbody>
          {equipment?.map((item) => (
            <tr key={item.id}>
              <td>{item.nazvanie}</td>
              <td>{item.markirovka}</td>
              <td>{item.tipOborudovaniya?.nazvanie}</td>
              <td>{item.kharakteristiki}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
