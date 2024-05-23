import { Router } from 'express';

const router = Router();

router.get('/chat', (req, res) => {
    res.render('chat', {});
});

router.get('/products', (req, res) => {
    const data = [];
    res.render('products', { data: data });
});

router.get('/carts', (req, res) => {
    const carts = []; 
    res.render('carts', { carts: carts });
});

export default router;