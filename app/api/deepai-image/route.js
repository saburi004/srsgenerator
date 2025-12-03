import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are an expert UI/UX product designer.
Your task is to design ONLY the 4 MOST IMPORTANT SCREENS of the project.

Generate EXACTLY 4 core screens based on the project's main functionality.
Focus on the pages that are essential for the real working product.

These 4 screens should be:
1. The main Home or Landing screen
2. The primary core feature screen (most important functionality)
3. A secondary but essential feature screen
4. Another major functional screen that completes the main user flow

Do NOT include login, signup, splash, or profile unless they are core to the project’s purpose.

For each screen, clearly describe:
- Layout structure
- Navigation elements
- Buttons & actions
- Cards, forms, tables, lists, charts, or widgets
- How the user interacts with the screen

Design Style:
- Modern
- Clean
- Minimalist
- Soft colors
- Professional spacing
- Realistic product UI mockups
`;

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Missing prompt" },
        { status: 400 }
      );
    }

    // Generate only 4 UI screens
   const screens = [
  `Main Home or Landing Screen for project: ${prompt}`,
  `Primary Core Feature Screen for project: ${prompt}`,
  `Secondary Important Feature Screen for project: ${prompt}`,
  `Another Major Functional Screen for project: ${prompt}`,
];

    // Add system prompt to each screen instruction
    const uiPrompts = screens.map(
      (screen) => `${SYSTEM_PROMPT}\n\nGenerate UI mockup screen: ${screen}`
    );

    const images = [];

    // Call Stability AI 4 times
    for (const ui of uiPrompts) {
      const formData = new FormData();
      formData.append("prompt", ui);
      formData.append("aspect_ratio", "1:1");
      formData.append("output_format", "png");
      formData.append("width", "512");   // ADD
      formData.append("height", "512");  // ADD

      const response = await fetch(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      let result;

      // Handle cases where Stability returns non-JSON error
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      console.log("Stability Output:", result);

      if (result?.image) {
        images.push(`data:image/png;base64,${result.image}`);
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to generate images" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images, // contains 4 base64 image strings
    });
  } catch (err) {
    console.error("Stability Error:", err);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Use POST with {prompt}" },
    { status: 405 }
  );
}
