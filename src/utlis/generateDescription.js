import toastNotify from "@/utils/toast";
import axios from "axios";

const TOGETHER_API_KEY =
  "cc956594be8ccb6e3b92b81609d35a2b93b8afe0f59aa4a32b53eb9add84759a";

export const generateAdDescription = async ({ description, title }) => {
  const prompt = `
  إعلاني بعنوان ${title}.
  قم بتحسين هذا الوصف الخاص بإعلاني واجعله جذابا لا تقم بإضافة اي بيانات جديدة فقط قم بتحسين النص لغويا و املاءيا
  ${description}
  ملاحظة: اجعل النص ذو طابع رسمي
  لا تخاطبني, فقط قم بإرجاع النص
  لا تجعل النص يحتوي على علامات تنصيص نص سادة فقط
  `;
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    toastNotify("حدث خطأ أثناء توليد الوصف", "error");
    return "حدث خطأ أثناء توليد الوصف.";
  }
};
