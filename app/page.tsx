"use client"; // Ensure this is at the top of the component

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <header className="p-5 flex justify-between items-center">
      </header>

      <main className="container mx-auto px-4 py-16 flex items-center justify-between">
        <div className="max-w-xl">
          <p className="text-xl mb-4">HI THERE 👋 I&apos;M</p> {/* Use &apos; here */}
          <h1 className="text-6xl font-bold mb-4">Mithil Girish</h1>
        </div>
      </main>

      {/* Other components */}
    </div>
  );
}
