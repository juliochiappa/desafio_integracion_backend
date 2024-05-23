import path from 'path';


const config = {
    SERVER: 'atlas_16',
    PORT: 8080,
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
    //MONGODB_URI: 'mongodb://127.0.0.1:27017/ecommerce',
    MONGODB_URI: 'mongodb+srv://coder_53160:coder2024@clustercoder.ueqobzv.mongodb.net/ecommerce',
    
};

export default config;