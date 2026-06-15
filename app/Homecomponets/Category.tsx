'use client';
import { motion } from 'framer-motion';
import { Shirt, ShoppingBag, Watch, Gem, ShoppingBasket, Handbag, ArrowRight } from 'lucide-react';
import TopInfo from '../__global_components/TopInfo';

const categories = [
    { name: 'Men', icon: <Shirt className="w-8 h-8" />, color: 'from-rose-500 to-orange-400', count: '120+ items' },
    { name: 'Women', icon: <ShoppingBag className="w-8 h-8" />, color: 'from-amber-500 to-yellow-400', count: '200+ items' },
    { name: 'Accessories', icon: <Watch className="w-8 h-8" />, color: 'from-sky-500 to-cyan-400', count: '85+ items' },
    { name: 'Jewelry', icon: <Gem className="w-8 h-8" />, color: 'from-purple-500 to-pink-400', count: '64+ items' },
    { name: 'Shoes', icon: <ShoppingBasket className="w-8 h-8" />, color: 'from-indigo-500 to-blue-400', count: '150+ items' },
    { name: 'Bags', icon: <Handbag className="w-8 h-8" />, color: 'from-red-500 to-rose-400', count: '90+ items' },
];

export default function CategoryMarquee() {
    return (
        <section className="relative py-20  overflow-hidden">
            <TopInfo title="Shop by Category" desc="Explore the best styles curated for you." />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            whileHover={{ y: -6 }}
                            className="group relative flex flex-col justify-between min-h-[180px] p-5 rounded-3xl bg-white border border-gray-100 shadow-2xl shadow-gray-100 hover:shadow-2xl transition-shadow cursor-pointer overflow-hidden"
                        >
                            {/* gradient glow on hover */}
                            <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${cat.color} text-white shadow-md`}>
                                {cat.icon}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                                <p className="text-sm text-gray-400 mb-2">{cat.count}</p>
                                <div className="flex items-center gap-1 text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                                    Shop now <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}