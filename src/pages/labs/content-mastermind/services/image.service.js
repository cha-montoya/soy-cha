export async function generateImage(contentId) {
    console.log("Generate image:", contentId);

    // Simulación de llamada al backend
    await new Promise((resolve) => setTimeout(resolve, 2500));

    return {
        success: true,
    };
}