import React from "react";
import { useQuery } from "@tanstack/react-query";
import equipmentService from "@/services/equipment.service";

export function EquipmentPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["equipment"],
    queryFn: () => equipmentService.fetchAll(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <h1>Equipment</h1>
      <table>
        <thead>
          <tr>
            <th>Marking</th>
            <th>Type</th>
            <th>Characteristics</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((equipment) => (
            <tr key={equipment.id}>
              <td>{equipment.marking}</td>
              <td>{equipment.equipmentType.name}</td>
              <td>{equipment.characteristics}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
