import { RentalPeriod, swapOptions, SyriaCities } from "@/data/General";
import {
  StyledInput,
  StyledPriceInput,
  StyledSelect,
  StyledSpaceCompact,
  StyledTextArea,
} from "@/pages/publish-ad/styled";
import {
  Alert,
  Checkbox,
  Col,
  Row,
  Tooltip,
  Progress,
  Divider,
  Breadcrumb,
  Button,
  Typography,
} from "antd";
import axios from "axios";
import {
  DollarCircleIcon,
  ImageUploadIcon,
  Delete01Icon,
  MapsLocation01Icon,
} from "hugeicons-react";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import imageCompression from "browser-image-compression";
import OvalLoader from "@/components/OvalLoader";
import toastNotify from "@/utils/toast";
import { MapSelector } from "@/components/MapSelector";

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

const formatPrice = (price) => {
  if (!price) return "";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parsePrice = (price) => {
  if (!price) return 0;
  return parseInt(price.toString().replace(/,/g, ""));
};

const ImageItem = memo(
  ({ image, index, id, handleDelete, isUploading, progress, originalId }) => {
    const style = {
      cursor: isUploading ? "default" : "default",
      opacity: 1,
    };

    const featureTag =
      index === 0 && !isUploading ? (
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
      ) : null;

    const imgStyle = {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      aspectRatio: "16/9",
      borderRadius: "0.6rem",
      border: index === 0 ? "3px solid #ffe800" : "",
    };

    return (
      <ImageWrapper style={style}>
        <img src={image} alt={`Preview ${index}`} style={imgStyle} />
        {isUploading && (
          <LoadingOverlay>
            <OvalLoader primary="#fff" />
            {progress > 0 && (
              <Progress
                percent={progress}
                status="active"
                style={{ width: "80%", marginTop: "1rem" }}
              />
            )}
          </LoadingOverlay>
        )}
        {!isUploading && index !== 0 && (
          <DeleteButton onClick={() => handleDelete(id, originalId)}>
            <Delete01Icon size={16} />
          </DeleteButton>
        )}
        {featureTag}
      </ImageWrapper>
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

const AdEditMode = ({ ad, onUpdate, setEditMode }) => {
  const dispatch = useDispatch();
  const { updatingLoading } = useSelector((state) => state.myAdvertisements);
  const [mapVisible, setMapVisible] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [state, setState] = useState({
    title: ad?.title || "",
    description: ad?.description || "",
    price: ad?.price ? formatPrice(parseInt(ad.price).toString()) : "",
    city: ad?.city || null,
    location: ad?.location || "",
    videoUrl: ad?.video_url || "",
    isSwap: ad?.saleDetail_details?.is_swap ?? null,
    rentalPeriod: ad?.rentDetail_details?.rental_period || null,
    features:
      ad?.features?.flatMap((f) => f.features?.map((sub) => sub.id)) || [],
    newImages: [],
    existingImages: [],
    deletedImageIds: [],
  });

  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [inputWarnings, setInputWarnings] = useState({});
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [featureGroups, setFeatureGroups] = useState([]);
  const [featureLoading, setFeatureLoading] = useState(false);
  const [featureError, setFeatureError] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [processingFiles, setProcessingFiles] = useState({});
  const [initialImagesLoaded, setInitialImagesLoaded] = useState(false);

  const fileInputRef = useRef(null);
  const compressQueue = useRef([]);
  const isProcessing = useRef(false);
  const objectURLCache = useRef(new Map());

  const category = ad?.category?.id;
  const MAX_IMAGES = 10;

  const isMaxImagesReached = previewImages.length >= MAX_IMAGES;
  useEffect(() => {
    if (state.location) {
      try {
        const locationUrl = new URL(state.location);
        const params = locationUrl.searchParams.get("q");
        if (params) {
          setLocationText(`تم تحديد الموقع على الخريطة بنجاح`);

          const coordinates = params.split(",");
          if (coordinates.length === 2) {
            const lat = parseFloat(coordinates[0]);
            const lng = parseFloat(coordinates[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
              setSelectedMapLocation({ lat, lng });
            }
          }
        } else {
          setLocationText("تم تحديد الموقع");
        }
      } catch (e) {
        setLocationText(state.location);
      }
    } else {
      setLocationText("");
      setSelectedMapLocation(null);
    }
  }, [state.location]);
  const handleShowMap = () => {
    setIsLoadingLocation(true);
    setMapVisible(true);
    setTimeout(() => {
      setIsLoadingLocation(false);
    }, 500);
  };

  const handleLocationSelect = (position) => {
    setIsLoadingLocation(true);
    const { lat, lng } = position;
    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    updateField("location", googleMapsLink);
    setSelectedMapLocation(position);
    setIsLoadingLocation(false);
  };
  useEffect(() => {
    if (ad) {
      setState({
        title: ad.title || "",
        description: ad.description || "",
        price: ad.price ? formatPrice(parseInt(ad.price).toString()) : "",
        city: ad.city || null,
        location: ad.location || "",
        videoUrl: ad.video_url || "",
        isSwap: ad.saleDetail_details?.is_swap ?? null,
        rentalPeriod: ad.rentDetail_details?.rental_period || null,
        features:
          ad?.features?.flatMap((f) => f.features?.map((sub) => sub.id)) || [],
        newImages: [],
        existingImages: [],
        deletedImageIds: [],
      });

      setInitialImagesLoaded(false);
    }
  }, [ad]);

  useEffect(() => {
    const loadInitialImages = async () => {
      if (ad?.images && ad?.images.length > 0 && !initialImagesLoaded) {
        try {
          const initialImages = ad.images.map((image) => ({
            id: `existing-${image.id}`,
            imageUrl: image.url.replace(
              "syr-souq.fra1.digitaloceanspaces.com",
              "syr-souq.fra1.cdn.digitaloceanspaces.com"
            ),
            originalId: image.id,
            isExisting: true,
            isUploading: false,
            progress: 100,
          }));

          setPreviewImages(initialImages);
          setInitialImagesLoaded(true);
        } catch (error) {
          toastNotify("حدث خطأ أثناء تحميل الصور الحالية", "error");
        }
      }
    };

    loadInitialImages();
  }, [ad, initialImagesLoaded]);

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!category) return;
      setFeatureLoading(true);
      setFeatureError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/feature-groups/${category}/category`
        );

        setFeatureGroups(response.data);
      } catch (err) {
        setFeatureError(
          "حدث خطأ أثناء تحميل الميزات، لكن لا تقلق، لا يزال بإمكانك نشر إعلانك."
        );
      } finally {
        setFeatureLoading(false);
      }
    };
    fetchFeatures();
  }, [category]);

  useEffect(() => {
    return () => {
      objectURLCache.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      objectURLCache.current.clear();
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

            setState((prev) => {
              const newList = [...prev.newImages];
              const index = prev.newImages.indexOf(file);
              if (index !== -1) {
                newList[index] = compressed;
              } else {
                newList.push(compressed);
              }
              return {
                ...prev,
                newImages: newList,
              };
            });

            setPreviewImages((prev) => {
              return prev.map((item) => {
                if (item.id === id) {
                  return {
                    ...item,
                    isUploading: false,
                    progress: 100,
                  };
                }
                return item;
              });
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

      if (previewImages.length + validFiles.length > MAX_IMAGES) {
        toastNotify(`لا يمكنك رفع أكثر من ${MAX_IMAGES} صور`, "warning");
        return;
      }

      const newImageItems = validFiles.map((file) => {
        const fileId = `new-${Date.now()}-${Math.random()}`;

        const objectUrl = URL.createObjectURL(file);
        objectURLCache.current.set(fileId, objectUrl);

        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: 0,
        }));

        setProcessingFiles((prev) => ({
          ...prev,
          [fileId]: file,
        }));

        return {
          id: fileId,
          imageUrl: objectUrl,
          originalFile: file,
          isUploading: true,
          progress: 0,
        };
      });

      setPreviewImages((prev) => [...prev, ...newImageItems]);

      setTimeout(() => {
        const filesToProcess = newImageItems.map((item) => ({
          file: item.originalFile,
          id: item.id,
        }));
        compressQueue.current.push(...filesToProcess);
        processNextBatch();
      }, 100);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setIsDragging(false);
    },
    [validateFile, processNextBatch, previewImages.length]
  );

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();

      if (isMaxImagesReached) {
        toastNotify(
          `لقد وصلت إلى الحد الأقصى من الصور (${MAX_IMAGES})`,
          "warning"
        );
        setIsDragging(false);
        return;
      }

      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      const validFiles = files.filter(validateFile);
      if (validFiles.length === 0) return;

      if (previewImages.length + validFiles.length > MAX_IMAGES) {
        toastNotify(`لا يمكنك رفع أكثر من ${MAX_IMAGES} صور`, "warning");
        return;
      }

      const newImageItems = validFiles.map((file) => {
        const fileId = `new-${Date.now()}-${Math.random()}`;

        const objectUrl = URL.createObjectURL(file);
        objectURLCache.current.set(fileId, objectUrl);

        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: 0,
        }));

        setProcessingFiles((prev) => ({
          ...prev,
          [fileId]: file,
        }));

        return {
          id: fileId,
          imageUrl: objectUrl,
          originalFile: file,
          isUploading: true,
          progress: 0,
        };
      });

      setPreviewImages((prev) => [...prev, ...newImageItems]);

      setTimeout(() => {
        const filesToProcess = newImageItems.map((item) => ({
          file: item.originalFile,
          id: item.id,
        }));
        compressQueue.current.push(...filesToProcess);
        processNextBatch();
      }, 100);
    },
    [validateFile, isMaxImagesReached, processNextBatch, previewImages.length]
  );

  const handleDeleteImage = useCallback((id, originalId) => {
    if (originalId) {
      setState((prev) => ({
        ...prev,
        deletedImageIds: [...prev.deletedImageIds, originalId],
      }));
      setPreviewImages((prev) => prev.filter((item) => item.id !== id));
    } else {
      setPreviewImages((prev) => {
        const itemToRemove = prev.find((item) => item.id === id);

        if (itemToRemove && itemToRemove.originalFile) {
          setState((prevState) => ({
            ...prevState,
            newImages: prevState.newImages.filter(
              (file) => file !== itemToRemove.originalFile
            ),
          }));
        }

        return prev.filter((item) => item.id !== id);
      });
    }

    if (objectURLCache.current.has(id)) {
      URL.revokeObjectURL(objectURLCache.current.get(id));
      objectURLCache.current.delete(id);
    }

    toastNotify("تمت إزالة الصورة بنجاح", "success");
  }, []);

  const openFileDialog = useCallback(() => {
    if (isMaxImagesReached) {
      toastNotify(
        `لقد وصلت إلى الحد الأقصى من الصور (${MAX_IMAGES})`,
        "warning"
      );
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

  const isGroupAllSelected = useCallback(
    (group) => {
      return group.features.every((feature) =>
        state.features.includes(feature.id)
      );
    },
    [state.features]
  );

  const isGroupPartiallySelected = useCallback(
    (group) => {
      const selectedFeatures = group.features.filter((feature) =>
        state.features.includes(feature.id)
      );
      return (
        selectedFeatures.length > 0 &&
        selectedFeatures.length < group.features.length
      );
    },
    [state.features]
  );

  const handleSelectAllFeatures = useCallback(
    (groupId, checked) => {
      const group = featureGroups.find((g) => g.group_id === groupId);
      const featureIds = group.features?.map((f) => f.id);
      setState((prev) => ({
        ...prev,
        features: checked
          ? [...new Set([...prev.features, ...featureIds])]
          : prev.features.filter((id) => !featureIds.includes(id)),
      }));
    },
    [featureGroups]
  );

  const handleFeatureChange = useCallback((featureId, checked) => {
    setState((prev) => ({
      ...prev,
      features: checked
        ? [...prev.features, featureId]
        : prev.features.filter((id) => id !== featureId),
    }));
  }, []);

  const updateField = useCallback((field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  }, []);

  const handlePriceChange = useCallback((e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9,]*$/.test(value)) {
      const rawValue = value.replace(/,/g, "");
      const formattedValue = formatPrice(rawValue);

      setState((prev) => ({ ...prev, price: formattedValue }));

      if (parsePrice(formattedValue) > 100000000) {
        setInputWarnings((prev) => ({
          ...prev,
          price: "السعر مرتفع جداً، تأكد من صحته",
        }));
      } else {
        setInputWarnings((prev) => ({
          ...prev,
          price: null,
        }));
      }
    }
  }, []);

  const handleVideoUrlChange = useCallback((e) => {
    const value = e.target.value;
    setState((prev) => ({ ...prev, videoUrl: value }));

    if (value) {
      const youtubeRegex =
        /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
      if (!youtubeRegex.test(value.trim())) {
        setErrors((prev) => ({
          ...prev,
          videoUrl: "يرجى إدخال رابط صالح من YouTube",
        }));
      } else {
        setErrors((prev) => ({ ...prev, videoUrl: null }));
      }
    } else {
      setErrors((prev) => ({ ...prev, videoUrl: null }));
    }
  }, []);

  const handleShareLocation = useCallback(() => {
    setLoading(true);
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          setState((prev) => ({ ...prev, location: googleMapsUrl }));
          setLoading(false);
        },
        (error) => {
          setLocationError(
            "فشل في الحصول على الموقع الحالي. الرجاء المحاولة مرة أخرى."
          );
          setLoading(false);
        }
      );
    } else {
      setLocationError("المتصفح لا يدعم تحديد الموقع الجغرافي");
      setLoading(false);
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!state.title || state.title.trim() === "") {
      newErrors.title = "يرجى إدخال عنوان";
    } else if (state.title.length > 100) {
      newErrors.title = "يجب ألا يتجاوز العنوان 100 حرف";
    } else {
      const prohibitedWords = [
        "إعلان",
        "اعلان",
        "الإعلان",
        "الاعلان",
        "إعلانات",
        "اعلانات",
        "ad",
        "ads",
        "advertisement",
        "announcement",
      ];

      let foundProhibitedWord = null;
      for (const word of prohibitedWords) {
        const regex = new RegExp(word, "i");
        const match = state.title.match(regex);

        if (match) {
          foundProhibitedWord = match[0];
          break;
        }
      }
      if (foundProhibitedWord) {
        newErrors.title = `كلمة "${foundProhibitedWord}" محظورة - يرجى تغييرها لتجنب الحظر من أدوات منع الإعلانات`;
      }
    }

    if (!state.description?.trim()) {
      newErrors.description = "وصف الإعلان مطلوب";
    }

    if (!state.city) {
      newErrors.city = "يرجى اختيار المدينة";
    }

    if (!state.price) {
      newErrors.price = "السعر مطلوب";
    } else if (parsePrice(state.price) <= 0) {
      newErrors.price = "يجب أن يكون السعر أكبر من 0";
    }

    if (ad?.type === "rent" && !state.rentalPeriod) {
      newErrors.rentalPeriod = "مدة الإيجار مطلوبة";
    }
    if (ad?.type === "sale" && state.isSwap === null) {
      newErrors.isSwap = "يرجى اختيار إمكانية المقايضة";
    }
    if (
      state.location &&
      state.location.trim() !== "" &&
      !state.location.includes("google.com/maps")
    ) {
      newErrors.location = "يرجى إدخال رابط صالح للموقع الجغرافي";
    }

    if (state.videoUrl && state.videoUrl.trim() !== "") {
      const youtubeRegex =
        /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/|m\.youtube\.com\/watch\?v=)[\w-]{11}([?&][\w-]+=[\w-]*)*\/?$/;
      if (!youtubeRegex.test(state.videoUrl.trim())) {
        newErrors.videoUrl = "يرجى إدخال رابط YouTube صالح";
      }
    }

    const totalImages = previewImages.length;
    if (totalImages === 0) {
      newErrors.images = "يجب إضافة صورة واحدة على الأقل";
    }

    setErrors(newErrors);
    setShowErrors(true);

    return Object.keys(newErrors).length === 0;
  }, [state, previewImages.length, ad?.type]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", state.title);
    formData.append("description", state.description);
    formData.append("price", parsePrice(state.price).toString());
    formData.append("city", state.city);
    formData.append("location", state.location);
    formData.append("video_url", state.videoUrl);

    if (state.features && state.features.length > 0) {
      state.features.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature);
      });
    }

    if (state.newImages && state.newImages.length > 0) {
      state.newImages.forEach((image, index) => {
        formData.append(`new_images[${index}]`, image);
      });
    }

    if (state.deletedImageIds && state.deletedImageIds.length > 0) {
      state.deletedImageIds.forEach((imageId, index) => {
        formData.append(`deleted_images_ids[${index}]`, imageId);
      });
    }

    if (ad?.type === "sale") {
      formData.append("sale_details[is_swap]", state.isSwap);
    } else if (ad?.type === "rent") {
      formData.append("rent_details[rental_period]", state.rentalPeriod);
    }

    if (onUpdate) {
      onUpdate(formData);
    }
  }, [validateForm, state, ad?.type, onUpdate]);

  const ImageGrid = memo(({ previewImages }) => {
    return (
      <div
        className="image-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {previewImages.map((item, index) => (
          <ImageItem
            key={item.id}
            image={item.imageUrl}
            index={index}
            id={item.id}
            originalId={item.originalId}
            handleDelete={handleDeleteImage}
            isUploading={item.isUploading}
            progress={item.progress}
          />
        ))}
      </div>
    );
  });

  const filteredPreviewImages = useMemo(() => {
    return previewImages.filter(
      (item) => !state.deletedImageIds.includes(item.originalId)
    );
  }, [previewImages, state.deletedImageIds]);

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
              ? `تم الوصول للحد الأقصى من الصور (${MAX_IMAGES})`
              : "انقر أو اسحب الصور للتحميل"}
          </p>
          <p className="fs-6 fw-light text-variant-1">
            الحد الأدنى صورة واحدة، والحد الأقصى {MAX_IMAGES} صور (JPEG/PNG/JPG)
            <br />
            حجم الملف يجب أن لا يتجاوز 50 ميجابايت
          </p>
        </div>
      </div>
    ),
    [isMaxImagesReached, MAX_IMAGES]
  );

  return (
    <>
      <div className="w-100 d-flex align-items-center justify-content-between myad-single-header">
        <div className="d-flex align-items-start flex-column">
          <Typography.Text className="fs-4 fw-bold mb-1">{ad?.title}</Typography.Text>
          <Breadcrumb
            items={[
              {
                title: "لوحة التحكم",
              },
              {
                title: "إعلاناتي",
                href: "/dashboard/my-advertisements",
              },
              {
                title: (
                  <Tooltip title={ad?.title}>
                    {ad?.title?.length > 20
                      ? `${ad.title.slice(0, 20)}...`
                      : ad.title}
                  </Tooltip>
                ),
              },
            ]}
          />
        </div>
        <div className="d-flex align-items-center gap-2 ad-editmode-actions">
          <button
            className="btn"
            onClick={() => {
              setEditMode(false);
            }}
          >
            إلغاء
          </button>
          <button
            className="tf-btn primary text-dark"
            onClick={handleSubmit}
            disabled={updatingLoading}
          >
            {updatingLoading ? <OvalLoader /> : "حفظ التعديلات"}
          </button>
        </div>
      </div>
      <Divider />

      <Row gutter={[80, 40]}>
        <Col xs={24} xxl={12}>
          <div className="w-100 d-flex flex-column gap-3">
            <Alert
              closeIcon
              showIcon
              message="الصورة الأولى هي صورة العرض الأساسية للإعلان ولا يمكن حذفها."
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

            {filteredPreviewImages.length > 0 && (
              <ImageGrid previewImages={filteredPreviewImages} />
            )}
          </div>
        </Col>

        <Col xs={24} xxl={12}>
          <div className="box w-100 d-flex flex-column gap-2">
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
              <label className="fs-6 mb-0 fw-normal">عنوان الإعلان</label>
              <small className="mb-2 text-variant-1">
                الإعلان يجب أن يكون جذابًا ومختصرًا، فهو أول ما يراه الزوار
              </small>
              <StyledInput
                value={state.title}
                onChange={(e) => updateField("title", e.target.value)}
                maxLength={100}
                showCount
                placeholder="ادخل عنوان الإعلان"
                id="title"
                status={showErrors && errors?.title ? "error" : ""}
              />
              {showErrors && errors?.title && (
                <div className="error-message text-danger mt-1">
                  {errors.title}
                </div>
              )}
            </fieldset>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
              <label className="fs-6 mb-0 fw-normal">معلومات تفصيلية</label>
              <small className="mb-2 text-variant-1">
                استخدم هذا الحقل لإضافة شرح تفصيلي عن ما تعلن عنه
              </small>
              <StyledTextArea
                maxLength={300}
                showCount
                rows={4}
                value={state.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="ادخل تفاصيل الإعلان"
                name="description"
                status={showErrors && errors?.description ? "error" : ""}
              />
              {showErrors && errors?.description && (
                <div className="error-message text-danger mt-1">
                  {errors.description}
                </div>
              )}
            </fieldset>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
              <label className="mb-2 fs-6 fw-normal">المدينة</label>
              <StyledSelect
                showSearch
                value={state.city}
                placeholder="اختر المدينة"
                options={SyriaCities}
                onChange={(value) => updateField("city", value)}
                dropdownRender={(menu) => (
                  <div
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      scrollbarWidth: "none",
                    }}
                  >
                    {menu}
                  </div>
                )}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase()) ||
                  (option?.value ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="w-100"
                status={showErrors && errors?.city ? "error" : ""}
              />
              {showErrors && errors?.city && (
                <div className="error-message text-danger mt-1">
                  {errors.city}
                </div>
              )}
            </fieldset>
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
              <label className="mb-2 fs-6 fw-normal">السعر</label>
              {ad?.type === "sale" || !ad?.type ? (
                <>
                  <StyledPriceInput
                    placeholder="ادخل السعر"
                    value={state.price}
                    onChange={handlePriceChange}
                    className="w-100"
                    type="text"
                    prefix={<DollarCircleIcon />}
                    status={
                      showErrors && errors?.price
                        ? "error"
                        : inputWarnings.price
                          ? "warning"
                          : ""
                    }
                  />
                  {showErrors && errors?.price && (
                    <div className="error-message text-danger mt-1">
                      {errors.price}
                    </div>
                  )}
                  {inputWarnings.price && !errors?.price && (
                    <div className="warning-message text-warning mt-1">
                      {inputWarnings.price}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <StyledSpaceCompact direction="horizontal">
                    <StyledPriceInput
                      placeholder="ادخل السعر"
                      value={state.price}
                      onChange={handlePriceChange}
                      className="w-100"
                      type="text"
                      prefix={<DollarCircleIcon />}
                      status={
                        showErrors && errors?.price
                          ? "error"
                          : inputWarnings.price
                            ? "warning"
                            : ""
                      }
                    />
                    <StyledSelect
                      dropdownRender={(menu) => (
                        <div
                          onWheel={(e) => e.stopPropagation()}
                          onTouchMove={(e) => e.stopPropagation()}
                          style={{
                            maxHeight: "200px",
                            overflowY: "auto",
                            scrollbarWidth: "none",
                          }}
                        >
                          {menu}
                        </div>
                      )}
                      value={state.rentalPeriod}
                      placeholder="مدة الايجار"
                      options={RentalPeriod}
                      onChange={(value) => updateField("rentalPeriod", value)}
                      status={showErrors && errors?.rentalPeriod ? "error" : ""}
                    />
                  </StyledSpaceCompact>
                  {showErrors && errors?.price && (
                    <div className="error-message text-danger mt-1">
                      {errors.price}
                    </div>
                  )}
                  {inputWarnings.price && !errors?.price && (
                    <div className="warning-message text-warning mt-1">
                      {inputWarnings.price}
                    </div>
                  )}
                  {showErrors && errors?.rentalPeriod && (
                    <div className="error-message text-danger mt-1">
                      {errors.rentalPeriod}
                    </div>
                  )}
                </>
              )}
              <Alert
                type="info"
                className="mt-2 w-100"
                showIcon
                closable
                message="أدخل سعراً منطقياً (بالدولار الأمريكي) يعكس قيمة الإعلان ويساعدك في جذب المهتمين بشكل أكبر"
              />
            </fieldset>
            {ad?.type === "sale" && (
              <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
                <label className="mb-2 fs-6 fw-normal">قابل للمقايضة؟</label>
                <StyledSelect
                  dropdownRender={(menu) => (
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                      }}
                    >
                      {menu}
                    </div>
                  )}
                  value={state.isSwap}
                  placeholder="اختر إمكانية المقايضة"
                  options={swapOptions}
                  onChange={(value) => updateField("isSwap", value)}
                  className="w-100"
                  status={showErrors && errors?.isSwap ? "error" : ""}
                />
                {showErrors && errors?.isSwap && (
                  <div className="error-message text-danger mt-1">
                    {errors.isSwap}
                  </div>
                )}
              </fieldset>
            )}
            <fieldset className="box-fieldset mb-3 d-flex flex-column align-items-start">
              <label className="fs-6 fw-normal mb-0">
                الموقع الجغرافي{" "}
                <small className="fs-13 text-variant-1 fw-normal">
                  (اختياري)
                </small>
              </label>

              <div className="d-flex flex-column w-100">
                {locationText ? (
                  <div className="d-flex gap-2 justify-content-between align-items-center w-100">
                    <div className="text-success">
                      <span>{locationText}</span>
                    </div>
                    <Button
                      type="text"
                      danger
                      size="large"
                      onClick={() => updateField("location", "")}
                    >
                      إلغاء تحديد الموقع
                    </Button>
                  </div>
                ) : null}

                <Button
                  type="primary"
                  size="large"
                  className="text-dark mt-2"
                  disabled={isLoadingLocation}
                  icon={
                    isLoadingLocation ? null : (
                      <MapsLocation01Icon
                        size={20}
                        style={{
                          marginTop: "0.4rem",
                        }}
                      />
                    )
                  }
                  onClick={handleShowMap}
                >
                  {isLoadingLocation ? (
                    <OvalLoader />
                  ) : locationText ? (
                    "عرض الموقع على الخريطة"
                  ) : (
                    "حدد الموقع على الخريطة"
                  )}
                </Button>
              </div>
              {locationError && (
                <div className="error-message text-danger mt-1">
                  {locationError}
                </div>
              )}
              {showErrors && errors?.location && (
                <div className="error-message text-danger mt-1">
                  {errors.location}
                </div>
              )}
            </fieldset>
            <fieldset className="box-fieldset mb-3  d-flex flex-column align-items-start">
              <div className="d-flex flex-row align-items-center w-100 gap-1">
                <label className="fs-6 mb-0 fw-normal">
                  رابط الفيديو{" "}
                  <small className="fs-13 text-variant-1 fw-normal">
                    (اختياري)
                  </small>
                </label>
              </div>
              <small className="mb-2 text-variant-1">
                أضف فيديو YouTube لشرح إعلانك بشكل أوضح
              </small>
              <StyledInput
                value={state.videoUrl}
                placeholder="ادخل رابط الفيديو على Youtube"
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

            <label className="fs-6 mb-1 fw-normal">الميزات الإضافية</label>
            {featureLoading ? (
              <div className="w-100 d-flex flex-column gap-2 align-items-center justify-content-center mb-3">
                <OvalLoader />
                <p>جار تحميل الميزات...</p>
              </div>
            ) : featureError ? (
              <Alert
                className="w-100"
                message={featureError}
                type="error"
                showIcon
              />
            ) : featureGroups?.length > 0 ? (
              <Row gutter={[16, 16]}>
                {featureGroups?.map((group) => (
                  <Col lg={6} sm={12} xs={12} key={group.group_id}>
                    <div className="d-flex  align-items-center mb-2">
                      <Tooltip
                        title={
                          isGroupAllSelected(group)
                            ? "الغاء تحديد الكل"
                            : "تحديد الكل"
                        }
                      >
                        <Checkbox
                          onChange={(e) =>
                            handleSelectAllFeatures(
                              group.group_id,
                              e.target.checked
                            )
                          }
                          checked={isGroupAllSelected(group)}
                          indeterminate={isGroupPartiallySelected(group)}
                        >
                          <p className="mb-0 fs-5">{group.group_name}</p>
                        </Checkbox>
                      </Tooltip>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {group.features?.map((feature) => (
                        <Checkbox
                          key={feature.id}
                          onChange={(e) =>
                            handleFeatureChange(feature.id, e.target.checked)
                          }
                          checked={state.features.includes(feature.id)}
                        >
                          <p className="fs-6 fw-normal lh-0">{feature.name}</p>
                        </Checkbox>
                      ))}
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert
                className="w-100"
                message="لا توجد ميزات مضافة حاليًا لهذه الفئة. يمكنك متابعة نشر إعلانك دون مشاكل."
                type="info"
                showIcon
              />
            )}
          </div>
        </Col>
      </Row>
      <MapSelector
        visible={mapVisible}
        onCancel={() => setMapVisible(false)}
        onLocationSelect={handleLocationSelect}
        defaultLocation={selectedMapLocation}
      />
    </>
  );
};

export default AdEditMode;
