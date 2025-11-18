# Next.js Admin Dashboard Template

A modern, clean admin dashboard template built with Next.js 15, TypeScript, and Tailwind CSS. Features a beautiful dark theme, responsive layout, and reusable components.

## Features

- ✨ **Next.js 15** with App Router
- 🎨 **Tailwind CSS** for styling
- 📘 **TypeScript** for type safety
- 🌙 **Dark theme** with modern design
- 📱 **Responsive layout** with sidebar navigation
- 🧩 **Reusable components** (Card, Table, Layout)
- 📊 **Sample pages** with dummy data
- 🔧 **ESLint & Prettier** configured
- 📁 **src/ directory** structure

## Project Structure

```
nextjs-dashboard-template/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Overview page (/)
│   │   ├── users/
│   │   │   └── page.tsx       # Users page (/users)
│   │   ├── settings/
│   │   │   └── page.tsx       # Settings page (/settings)
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/             # Reusable components
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   ├── Sidebar.tsx        # Left sidebar navigation
│   │   ├── TopBar.tsx         # Top header bar
│   │   ├── Card.tsx           # Card component
│   │   └── Table.tsx          # Table component
│   └── lib/                    # Utility functions
├── public/                     # Static assets
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nextjs-dashboard-template
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Pages

### Overview (/)
- Dashboard overview with statistics cards
- Revenue and user growth charts (dummy data)
- Recent activity table

### Users (/users)
- User management interface
- User statistics
- Searchable user table with status indicators

### Settings (/settings)
- General settings (site name, language, timezone)
- Notification preferences with toggle switches
- Security settings

## Adding New Pages

To add a new page to the dashboard:

1. **Create a new route directory** in `src/app/`:
```bash
mkdir src/app/your-page
```

2. **Create a page.tsx file**:
```tsx
// src/app/your-page/page.tsx
import Card from "@/components/Card";

export default function YourPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Your Page</h1>
        <p className="mt-2 text-slate-400">Page description</p>
      </div>

      <Card title="Your Content">
        {/* Your content here */}
      </Card>
    </div>
  );
}
```

3. **Add navigation link** in `src/components/Sidebar.tsx`:
```tsx
const navigation = [
  { name: "Overview", href: "/", icon: "📊" },
  { name: "Users", href: "/users", icon: "👥" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
  { name: "Your Page", href: "/your-page", icon: "🎯" }, // Add this
];
```

That's it! Your new page will automatically be integrated into the dashboard layout with sidebar navigation.

## Components

### Card
Reusable card component for content sections:
```tsx
<Card title="Card Title" subtitle="Optional subtitle">
  <p>Your content here</p>
</Card>
```

### Table
Table component with dark theme styling:
```tsx
<Table
  columns={[
    { key: "name", header: "Name" },
    { key: "email", header: "Email" }
  ]}
  data={[
    { name: "John Doe", email: "john@example.com" }
  ]}
/>
```

### Layout
The Layout component provides the sidebar and top bar structure. It's automatically applied to all pages through `src/app/layout.tsx`.

## Customization

### Theme Colors
Edit `src/app/globals.css` to customize the color scheme:
```css
:root {
  --background: #0f172a;  /* Main background */
  --foreground: #f1f5f9;  /* Text color */
}
```

### Tailwind Configuration
Modify `tailwind.config.ts` to extend the theme with custom colors, fonts, or spacing.

### Components
All components are in `src/components/` and can be customized to fit your needs.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Formatting**: Prettier

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
