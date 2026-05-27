const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Address = require('./Address');

User.hasMany(Address, { foreignKey: 'user_id' });
Address.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');
    // Desativando alter: true temporariamente para evitar o erro de colunas duplicadas no SQLite
    await sequelize.sync(); 
    console.log('Modelos sincronizados com sucesso.');

    // Auto-seeding se o banco estiver completamente vazio de administradores
    const adminEmail = 'admin@paofacil.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      console.log('Banco de dados vazio de admins. Iniciando auto-seeding de segurança...');
      
      await User.create({
        nome: 'Administrador PãoFácil',
        email: adminEmail,
        senha: 'admin',
        role: 'admin',
        is_verified: true
      });
      console.log('✅ Usuário admin inicial criado com sucesso!');
      console.log(`Email: ${adminEmail} | Senha: admin`);
    }

    const productsCount = await Product.count();
    if (productsCount === 0) {
      await Product.bulkCreate([
        { nome: 'Pão Francês', descrição: 'Pão quentinho e crocante direto do forno.', preço: 0.75, disponível: true, imagem: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=500&q=80' },
        { nome: 'Pão de Queijo', descrição: 'Legítima receita tradicional mineira.', preço: 2.50, disponível: true, imagem: 'https://images.unsplash.com/photo-1595116768393-27eb660d5bfa?w=500&q=80' },
        { nome: 'Bolo de Cenoura', descrição: 'Bolo fofinho com cobertura de chocolate.', preço: 15.00, disponível: true, imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
        { nome: 'Coxinha de Frango', descrição: 'Massa super crocante e recheio cremoso.', preço: 6.50, disponível: true, imagem: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' },
        { nome: 'Croissant Gourmet', descrição: 'Receita francesa clássica, folhado e amanteigado.', preço: 8.90, disponível: true, imagem: 'https://images.unsplash.com/photo-1555507036-ab1e4006aa42?w=500&q=80' }
      ]);
      console.log('✅ Catálogo de padaria inicial populado (5 produtos).');
    }
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:');
    console.error(error.message);
    if (error.original) console.error('Original Error:', error.original.message);
    if (error.sql) console.error('SQL:', error.sql);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Product,
  Order,
  OrderItem,
  Address
};
