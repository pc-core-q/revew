// imagebb-config.js
export const IMGBB_API_KEY = "820a1a52d1b835874a9200fe7d3bb6b3";

export async function uploadImageToImgBB(file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (data.success) {
        return data.data.url; // رابط الصورة المباشر
    } else {
        throw new Error(data.error?.message || "فشل رفع الصورة إلى ImgBB");
    }
}
