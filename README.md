# 🚀 Minimal Next.js + TypeScript + Tailwind CSS

This is a clean, minimal environment to learn and build your web app step-by-step.

---

## 📁 Current File Structure

Inside `src/app/`, there are now only 3 essential files:

```text
src/
└── app/
    ├── globals.css   # Loads Tailwind CSS styling rules
    ├── layout.tsx    # HTML page shell (<html> and <body>)
    └── page.tsx      # Your main page (Displays "Hello World!")
```

---

## 💻 How to Code

1. Open [`src/app/page.tsx`](file:///d:/Programming/Campus_Commerce/src/app/page.tsx).
2. Edit the text or add new HTML tags:
   ```tsx
   export default function Home() {
     return (
       <main className="flex min-h-screen items-center justify-center bg-gray-50">
         <h1 className="text-4xl font-bold text-blue-600">
           Hello World! 🚀
         </h1>
       </main>
     );
   }
   ```
3. Save the file.
4. Your browser at [http://localhost:3000](http://localhost:3000) will immediately update!
