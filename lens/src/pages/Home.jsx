import { useStore } from '../contexts/StoreContext';
import ProductCard from '../components/ProductCard';
import { Sparkles, Shield, SunDim } from 'lucide-react';

export default function Home() {
  const { products } = useStore();

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621570074981-ee6a0145c8b5?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>The Future of Vision</span>
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            React to your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Environment</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed font-light">
            Premium photochromic lenses that seamlessly adapting to light shifts. Ultimate clarity indoors. Maximum protection outdoors.
          </p>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <SunDim className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Instant Transition</h3>
              <p className="text-sm text-slate-500 mt-2">Darkens under UV in seconds</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900">100% UV Block</h3>
              <p className="text-sm text-slate-500 mt-2">Maximum eye protection</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Crystal Clarity</h3>
              <p className="text-sm text-slate-500 mt-2">Zero distortion technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Our Collection</h2>
            <p className="text-slate-500 mt-2">Engineered for perfection, designed for you.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 bg-white border border-dashed border-slate-300 rounded-2xl">
              No lenses currently available. Admin needs to add products.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
