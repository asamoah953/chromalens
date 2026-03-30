import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Mail, Phone, ArrowLeft, ShieldCheck, Microscope, Layers } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useStore();
  
  const product = products.find(p => p._id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Product not found</h2>
          <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium">
            &larr; Return Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <div className="space-y-8">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-xl ring-1 ring-zinc-900/5">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Contact to Buy Widget */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-xl font-bold mb-2">Ready to order?</h3>
              <p className="text-slate-400 mb-6 text-sm">Reach out to us directly to purchase {product.name} or customize your lenses.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="mailto:asamoahclinton953@gmail.com"
                  className="w-full flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-xl transition-colors font-medium backdrop-blur-sm border border-white/10"
                >
                  <Mail className="h-5 w-5" />
                  <span>Email Admin</span>
                </a>
                
                <a 
                  href="tel:+2330555983599"
                  className="w-full flex items-center justify-center space-x-3 bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 rounded-xl transition-colors font-medium border border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                >
                  <Phone className="h-5 w-5" />
                  <span>0555983599</span>
                </a>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="mb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-indigo-600 mb-6">GH₵{parseFloat(product.price).toFixed(2)}</p>
              <p className="text-lg text-slate-600 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            <div className="space-y-12">
              {/* Importance & Benefits */}
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Why It's Essential</h3>
                </div>
                <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm">
                  <ul className="space-y-4">
                    {product.benefits?.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mr-4 mt-0.5">
                          <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                        </span>
                        <span className="text-slate-700 font-medium">{benefit}</span>
                      </li>
                    ))}
                    {(!product.benefits || product.benefits.length === 0) && (
                       <li className="text-slate-500 italic">Universal eye protection and automated transition features.</li>
                    )}
                  </ul>
                </div>
              </section>

              {/* Science Section */}
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                    <Microscope className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">What Science Says</h3>
                </div>
                <div className="bg-white border-l-4 border-indigo-600 p-8 rounded-r-2xl shadow-sm">
                  <p className="text-slate-700 leading-relaxed">
                    {product.science || "Modern photochromic technology binds light-sensitive molecules into the lens matrix, physically altering their structure when exposed to UV rays to darken the lens."}
                  </p>
                </div>
              </section>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
