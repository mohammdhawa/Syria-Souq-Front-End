import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { ImageUploadIcon, Delete01Icon } from "hugeicons-react";
import styled from "styled-components";
import imageCompression from "browser-image-compression";
import { useAdForm } from "../../../context/AdFormContext";
import OvalLoader from "@/components/OvalLoader";
import toastNotify from "@/utils/toast";
import { Alert } from "antd";
import { StyledInput } from "../styled";

const UploadContainer = styled.div`
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  background: #fafafa;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) => (props.disabled ? "#d9d9d9" : "#ffe800")};
    opacity: ${(props) => (props.disabled ? 0.6 : 0.8)};
  }
  &.drag-over {
    border-color: ${(props) => (props.disabled ? "#d9d9d9" : "#ffe800")};
    opacity: ${(props) => (props.disabled ? 0.6 : 0.8)};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  border-radius: 0.6rem;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16/9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 0.6rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  ${ImageWrapper}:hover & {
    opacity: 1;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 0.6rem;
`;

const objectURLCache = new Map();

const SortableImage = memo(
  ({ image, index, id, handleDelete, isUploading, progress }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id, disabled: isUploading });

    const style = useMemo(
      () => ({
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isUploading ? "default" : "grab",

        opacity: 1,
      }),
      [transform, transition, isUploading]
    );

    const objectUrl = useMemo(() => {
      const fileId = image.name + "-" + image.size;
      if (!objectURLCache.has(fileId)) {
        objectURLCache.set(fileId, URL.createObjectURL(image));
      }
      return objectURLCache.get(fileId);
    }, [image]);

    const featureTag = useMemo(() => {
      if (index === 0 && !isUploading) {
        return (
          <span
            style={{
              position: "absolute",
              top: "0rem",
              left: "0rem",
              background: "#ffe800",
              color: "#1e1e1e",
              padding: "0.5rem 1rem",
              borderRadius: "0.6rem 0rem",
              fontSize: "0.875rem",
              fontWeight: "bolder",
              zIndex: 2,
            }}
          >
            صورة العرض
          </span>
        );
      }
      return null;
    }, [index, isUploading]);

    const imgStyle = useMemo(
      () => ({
        width: "100%",
        height: "100%",
        objectFit: "cover",
        aspectRatio: "16/9",
        borderRadius: "0.6rem",
        border: index === 0 ? "3px solid #ffe800" : "",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }),
      [index]
    );

    return (
      <ImageWrapper
        ref={setNodeRef}
        style={style}
        {...(isUploading ? {} : { ...attributes, ...listeners })}
      >
        <img src={objectUrl} alt={`Preview ${index}`} style={imgStyle} />
        {isUploading && (
          <LoadingOverlay>
            <OvalLoader primary="#fff" />
          </LoadingOverlay>
        )}
        {!isUploading && (
          <DeleteButton onClick={() => handleDelete(id)}>
            <Delete01Icon size={16} />
          </DeleteButton>
        )}
        {featureTag}
      </ImageWrapper>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.image === nextProps.image &&
      prevProps.index === nextProps.index &&
      prevProps.id === nextProps.id &&
      prevProps.isUploading === nextProps.isUploading &&
      prevProps.progress === nextProps.progress &&
      JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
    );
  }
);

const UploadArea = memo(
  ({
    isDragging,
    isMaxImagesReached,
    onDrop,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onClick,
    children,
  }) => {
    return (
      <UploadContainer
        className={isDragging ? "drag-over" : ""}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onClick={onClick}
        disabled={isMaxImagesReached}
      >
        {children}
      </UploadContainer>
    );
  }
);

const ImageGrid = memo(
  ({
    previewImages,
    handleDelete,
    sensors,
    handleDragEnd,
    handleDragStart,
    handleDragCancel,
  }) => {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={previewImages.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div
            className="image-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
              willChange: "contents",
            }}
          >
            {previewImages.map((item, index) => (
              <SortableImage
                key={item.id}
                image={item.file}
                index={index}
                id={item.id}
                handleDelete={handleDelete}
                isUploading={item.isUploading}
                progress={item.progress}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.previewImages.length !== nextProps.previewImages.length)
      return false;

    for (let i = 0; i < prevProps.previewImages.length; i++) {
      const prevItem = prevProps.previewImages[i];
      const nextItem = nextProps.previewImages[i];

      if (
        prevItem.id !== nextItem.id ||
        prevItem.file !== nextItem.file ||
        prevItem.isUploading !== nextItem.isUploading
      ) {
        return false;
      }
    }

    return true;
  }
);

const CustomImageUpload = () => {
  const { state, updateField, showErrors } = useAdForm();
  const { images, videoUrl, errors } = state;
  const [fileList, setFileList] = useState(images || []);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [processingFiles, setProcessingFiles] = useState({});
  const [imageIds, setImageIds] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const [isDraggingActive, setIsDraggingActive] = useState(false);

  const fileInputRef = useRef(null);
  const compressQueue = useRef([]);
  const isProcessing = useRef(false);
  const previewUpdateTimeout = useRef(null);

  const isMaxImagesReached = useMemo(
    () => fileList.length >= 10,
    [fileList.length]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );
  useEffect(() => {
    return () => {
      objectURLCache.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      objectURLCache.clear();
    };
  }, []);

  const processNextBatch = useCallback(async () => {
    if (isProcessing.current || compressQueue.current.length === 0) return;

    isProcessing.current = true;

    try {
      const batch = compressQueue.current.splice(0, 2);

      await Promise.all(
        batch.map(async ({ file, id }) => {
          try {
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
              initialQuality: 0.9,
              onProgress: (percent) => {
                setUploadProgress((prev) => ({
                  ...prev,
                  [id]: Math.round(percent),
                }));
              },
            };

            const compressed = await imageCompression(file, options);

            setFileList((prev) => {
              const newList = [...prev];
              const index = prev.indexOf(file);
              if (index !== -1) {
                newList[index] = compressed;
              }
              return newList;
            });

            await new Promise((resolve) => setTimeout(resolve, 150));
          } finally {
            setUploadProgress((prev) => {
              const updated = { ...prev };
              delete updated[id];
              return updated;
            });

            setProcessingFiles((prev) => {
              const updated = { ...prev };
              delete updated[id];
              return updated;
            });
          }
        })
      );
    } finally {
      isProcessing.current = false;
      if (compressQueue.current.length > 0) {
        setTimeout(processNextBatch, 100);
      }
    }
  }, []);

  const validateFile = useCallback((file) => {
    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isImage) {
      toastNotify(`${file.name} ليس ملف صورة صالح (JPEG/PNG/JPG فقط)`, "error");
      return false;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toastNotify(
        `${file.name} حجم الملف كبير جدًا. الحد الأقصى هو 50 ميجابايت`,
        "error"
      );
      return false;
    }

    return true;
  }, []);

  const handleFileChange = useCallback(
    async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const validFiles = files.filter(validateFile);
      if (validFiles.length === 0) return;

      if (fileList.length + validFiles.length > 10) {
        toastNotify("لا يمكنك رفع أكثر من 10 صور", "warning");
        return;
      }

      const newFiles = validFiles.map((file) => {
        const fileId = `file-${Date.now()}-${Math.random()}`;

        const objectUrl = URL.createObjectURL(file);
        objectURLCache.set(file.name + "-" + file.size, objectUrl);

        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: 0,
        }));

        setProcessingFiles((prev) => ({
          ...prev,
          [fileId]: file,
        }));

        return {
          file,
          id: fileId,
        };
      });

      const tempFiles = newFiles.map((item) => item.file);
      setFileList((prev) => [...prev, ...tempFiles]);
      setTimeout(() => {
        compressQueue.current.push(...newFiles);
        processNextBatch();
      }, 100);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setIsDragging(false);
    },
    [validateFile, fileList, processNextBatch]
  );

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();

      if (isMaxImagesReached) {
        toastNotify("لقد وصلت إلى الحد الأقصى من الصور (10)", "warning");
        setIsDragging(false);
        return;
      }

      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      const validFiles = files.filter(validateFile);
      if (validFiles.length === 0) return;

      if (fileList.length + validFiles.length > 10) {
        toastNotify("لا يمكنك رفع أكثر من 10 صور", "warning");
        return;
      }

      const newFiles = validFiles.map((file) => {
        const fileId = `file-${Date.now()}-${Math.random()}`;
        const objectUrl = URL.createObjectURL(file);
        objectURLCache.set(file.name + "-" + file.size, objectUrl);

        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: 0,
        }));

        setProcessingFiles((prev) => ({
          ...prev,
          [fileId]: file,
        }));

        return {
          file,
          id: fileId,
        };
      });

      const tempFiles = newFiles.map((item) => item.file);
      setFileList((prev) => [...prev, ...tempFiles]);
      setTimeout(() => {
        compressQueue.current.push(...newFiles);
        processNextBatch();
      }, 100);
    },
    [validateFile, isMaxImagesReached, fileList, processNextBatch]
  );

  const handleDelete = useCallback(
    (id) => {
      setFileList((prev) => {
        const newFileList = prev.filter((_, index) => {
          const key = prev[index].name + index;
          return imageIds[key] !== id;
        });
        return newFileList;
      });

      setImageIds((prev) => {
        const newIds = { ...prev };
        Object.keys(newIds).forEach((key) => {
          if (newIds[key] === id) delete newIds[key];
        });
        return newIds;
      });

      toastNotify("تمت إزالة الصورة بنجاح", "success");
    },
    [imageIds]
  );

  const handleDragStart = useCallback(() => {
    setIsDraggingActive(true);

    if (previewUpdateTimeout.current) {
      clearTimeout(previewUpdateTimeout.current);
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    setIsDraggingActive(false);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (active && over && active.id !== over.id) {
        setFileList((items) => {
          const oldIndex = items.findIndex(
            (_, index) => imageIds[items[index].name + index] === active.id
          );
          const newIndex = items.findIndex(
            (_, index) => imageIds[items[index].name + index] === over.id
          );

          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(items, oldIndex, newIndex);
          }
          return items;
        });
      }

      setTimeout(() => {
        setIsDraggingActive(false);
      }, 50);
    },
    [imageIds]
  );

  const openFileDialog = useCallback(() => {
    if (isMaxImagesReached) {
      toastNotify("لقد وصلت إلى الحد الأقصى من الصور (10)", "warning");
      return;
    }
    fileInputRef.current.click();
  }, [isMaxImagesReached]);

  const handleDragOver = useCallback(
    (e) => {
      if (!isMaxImagesReached) e.preventDefault();
    },
    [isMaxImagesReached]
  );

  const handleDragEnter = useCallback(
    (e) => {
      if (!isMaxImagesReached) {
        e.preventDefault();
        setIsDragging(true);
      }
    },
    [isMaxImagesReached]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  useEffect(() => {
    if (images !== fileList) {
      updateField("images", fileList);
    }

    if (isDraggingActive) return;

    if (previewUpdateTimeout.current) {
      clearTimeout(previewUpdateTimeout.current);
    }

    previewUpdateTimeout.current = setTimeout(() => {
      const previews = fileList.map((file, index) => {
        const key = file.name + index;
        const id = imageIds[key] || `${Date.now()}-${Math.random()}`;

        if (!imageIds[key]) {
          setImageIds((prev) => ({ ...prev, [key]: id }));
        }

        const isUploading = Object.values(processingFiles).includes(file);

        let progress = 0;
        if (isUploading) {
          const fileId = Object.keys(processingFiles).find(
            (key) => processingFiles[key] === file
          );

          if (fileId && uploadProgress[fileId]) {
            progress = uploadProgress[fileId];
          }
        }

        return {
          file,
          id,
          isUploading,
          progress,
        };
      });

      setPreviewImages(previews);
    }, 50);

    return () => {
      if (previewUpdateTimeout.current) {
        clearTimeout(previewUpdateTimeout.current);
      }
    };
  }, [
    fileList,
    images,
    imageIds,
    updateField,
    uploadProgress,
    processingFiles,
    isDraggingActive,
  ]);

  const uploadContainerContent = useMemo(
    () => (
      <div className="d-flex flex-column align-items-center justify-content-center gap-3">
        <ImageUploadIcon
          size={36}
          style={{ color: isMaxImagesReached ? "#a0a0a0" : "#1e1e1e" }}
        />
        <div className="d-flex flex-column align-items-center justify-content-center gap-1">
          <p className="fs-5 fw-bolder">
            {isMaxImagesReached
              ? "تم الوصول للحد الأقصى من الصور (10)"
              : "انقر أو اسحب الصور للتحميل"}
          </p>
          <p className="fs-6 fw-light text-variant-1">
            الحد الأدنى صورة واحدة، والحد الأقصى 10 صور (JPEG/PNG/JPG)
            <br />
            حجم الملف يجب أن لا يتجاوز 50 ميجابايت
          </p>
        </div>
      </div>
    ),
    [isMaxImagesReached]
  );

  const handleVideoUrlChange = useCallback(
    (e) => {
      updateField("videoUrl", e.target.value);
    },
    [updateField]
  );

  return (
    <div className="w-100 d-flex flex-column gap-3">
      <Alert
        closeIcon
        showIcon
        message="يمكنك إعادة ترتيب الصور حسب رغبتك. 
ستكون الصورة الأولى هي صورة العرض الأساسية للإعلان، ولن تتمكن من تغييرها لاحقًا. 
"
      />

      {!isMaxImagesReached && (
        <UploadArea
          isDragging={isDragging}
          isMaxImagesReached={isMaxImagesReached}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          {uploadContainerContent}
          <HiddenInput
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={isMaxImagesReached}
          />
        </UploadArea>
      )}

      {showErrors && errors?.images && (
        <div className="error-message text-center text-danger mt-0">
          {errors.images}
        </div>
      )}

      {previewImages.length > 0 && (
        <ImageGrid
          previewImages={previewImages}
          handleDelete={handleDelete}
          sensors={sensors}
          handleDragEnd={handleDragEnd}
          handleDragStart={handleDragStart}
          handleDragCancel={handleDragCancel}
        />
      )}

      <fieldset className="box-fieldset mb-0 mt-3 d-flex flex-column align-items-start ">
        <div className="d-flex flex-row align-items-center w-100 gap-1">
          <label className="fs-6 mb-0 fw-normal">
            رابط الفيديو{" "}
            <small className="fs-13  text-variant-1 fw-normal">(اختياري)</small>
          </label>
        </div>
        <small className="mb-2 text-variant-1">
          أضف فيديو YouTube لشرح إعلانك بشكل أوضح
        </small>
        <StyledInput
          value={videoUrl}
          placeholder={"ادخل رابط الفيديو على Youtube"}
          onChange={handleVideoUrlChange}
          className="w-100"
          status={showErrors && errors?.videoUrl ? "error" : ""}
        />
        {showErrors && errors?.videoUrl && (
          <div className="error-message text-danger mt-1">
            {errors.videoUrl}
          </div>
        )}
      </fieldset>
    </div>
  );
};

export default CustomImageUpload;
