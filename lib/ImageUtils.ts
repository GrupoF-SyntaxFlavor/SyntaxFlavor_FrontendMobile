import { BACKEND_DOMAIN, MINIO_PORT } from "@/constants/.backend-dir";

const IMAGE_URL = `http://${BACKEND_DOMAIN}${MINIO_PORT}`

export const formatImages = (products: any) => {
    // replace the backend 'localhost' with the actual IP address
    // if the image URL is empty replace with palceholder
    return products.map((product: any) => {
      return {
        ...product,
        image: product.image
          ? product.image.replace("http://localhost:9000", IMAGE_URL)
          : "https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg",
      };
    });
  }