import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
            transition={{ duration: 0.4, delay: delay * 0.5 }}
            viewport={{ once: true }}
            className="p-8 rounded-[2.5rem] glass border border-white/40 bg-white/60 shadow-xl cursor-pointer"
        >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg">
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
};

export default FeatureCard;
