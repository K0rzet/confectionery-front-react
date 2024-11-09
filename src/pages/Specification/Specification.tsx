import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OperationsList } from "@/components/Specification/OperationsList/OperationsList";
import { IngredientsList } from "@/components/Specification/IngredientsList/IngredientsList";
import { DecorationsList } from "@/components/Specification/DecorationsList/DecorationsList";
import { SemifinishedList } from "@/components/Specification/SemifinishedList/SemifinishedList";
import { DimensionsList } from "@/components/Specification/DimensionsList/DimensionsList";
import { ImagesList } from "@/components/Specification/ImagesList/ImagesList";
import specificationService from "@/services/specification.service";
import {
  ISpecification,
  UpdateSpecificationDto,
  IProductImage,
} from "@/types/specification.types";
import styles from "./Specification.module.scss";

export const SpecificationPage = () => {
  const { izdelieId } = useParams<{ izdelieId: string }>();
  const [specification, setSpecification] = useState<ISpecification | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSpecification();
  }, [izdelieId]);

  const loadSpecification = async () => {
    if (!izdelieId) return;
    try {
      setIsLoading(true);
      const data = await specificationService.getSpecification(Number(izdelieId));
      console.log('Loaded specification:', data);
      
      // Преобразуем строки в объекты IProductImage
      const formattedImages: IProductImage[] = (data.izobrazhenia || []).map((imgUrl: string) => ({
        id: Date.now() + Math.random(),
        url: imgUrl.startsWith('/') ? imgUrl : `/uploads/orders/${imgUrl}`,
        tip: 'FOTO' as const, // используем as const для правильной типизации
        izdelieId: Number(izdelieId)
      }));
      
      setSpecification({
        ...data,
        izobrazhenia: formattedImages
      });
    } catch (error) {
      setError("Ошибка при загрузке спецификации");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!specification || !izdelieId) return;
    try {
      const dto: UpdateSpecificationDto = {
        razmery: Array.isArray(specification.razmeryIzdeliya)
          ? specification.razmeryIzdeliya.map((r) => ({
              nazvanie: r.nazvanie,
              znachenie: r.znachenie,
              edinitsaIzmereniya: r.edinitsaIzmereniya,
            }))
          : [],
        operatsii: Array.isArray(specification.operatsiiSpecs)
          ? specification.operatsiiSpecs.map((op) => ({
              operatsiya: op.operatsiya,
              poryadkovyyNomer: op.poryadkovyyNomer,
              tipOborudovaniya: op.tipOborudovaniya,
              vremyaOperatsii: op.vremyaOperatsii,
            }))
          : [],
        ingredienty: Array.isArray(specification.ingredientySpecs)
          ? specification.ingredientySpecs.map((ing) => ({
              ingredientId: ing.ingredientId,
              kolichestvo: ing.kolichestvo,
            }))
          : [],
        dekoratsii: Array.isArray(specification.dekorSpecs)
          ? specification.dekorSpecs.map((dek) => ({
              ukrashenieId: dek.ukrashenieId,
              kolichestvo: dek.kolichestvo,
            }))
          : [],
        polufabrikaty: Array.isArray(specification.polufabrikatySpecs)
          ? specification.polufabrikatySpecs.map((pf) => ({
              polufabrikatId: pf.polufabrikatId,
              kolichestvo: pf.kolichestvo,
            }))
          : [],
        izobrazhenia: specification.izobrazhenia.map(img => ({
          url: typeof img === 'string' ? img : img.url,
          tip: typeof img === 'string' ? 'FOTO' as const : img.tip
        }))
      };
      await specificationService.updateSpecification(Number(izdelieId), dto);
      await loadSpecification();
    } catch (error) {
      setError("Ошибка при сохранении спецификации");
      console.error(error);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!specification) return <div>Спецификация не найдена</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/orders")}
        >
          ← Назад к заказам
        </button>
        <h1>Спецификаци изделия #{izdelieId}</h1>
      </div>

      <div className={styles.content}>
        <DimensionsList
          dimensions={specification.razmeryIzdeliya || []}
          onUpdate={(dimensions) =>
            setSpecification((prev) =>
              prev ? { ...prev, razmeryIzdeliya: dimensions } : null
            )
          }
          izdelieId={Number(izdelieId)}
        />

        <OperationsList
          operations={specification?.operatsiiSpecs}
          onUpdate={(operations) =>
            setSpecification((prev) =>
              prev ? { ...prev, operatsiiSpecs: operations } : null
            )
          }
        />

        <IngredientsList
          ingredients={specification?.ingredientySpecs}
          onUpdate={(ingredients) =>
            setSpecification((prev) =>
              prev ? { ...prev, ingredientySpecs: ingredients } : null
            )
          }
        />

        <DecorationsList
          decorations={specification?.dekorSpecs}
          onUpdate={(decorations) =>
            setSpecification((prev) =>
              prev ? { ...prev, dekorSpecs: decorations } : null
            )
          }
        />

        <SemifinishedList
          semifinished={specification?.polufabrikatySpecs}
          onUpdate={(semifinished) =>
            setSpecification((prev) =>
              prev ? { ...prev, polufabrikatySpecs: semifinished } : null
            )
          }
        />

        <ImagesList
          images={specification.izobrazhenia || []}
          onUpdate={(images) => {
            console.log('Updating images:', images) // Для отладки
            setSpecification(prev => prev ? {...prev, izobrazhenia: images} : null)
          }}
          izdelieId={Number(izdelieId)}
        />

        <div className={styles.actions}>
          <button
            onClick={handleSave}
            className={styles.saveButton}
            disabled={isLoading}
          >
            {isLoading ? "Сохранение..." : "Схранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
};
