const { sequelize, User } = require('../models');

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const adminEmail = 'admin@paofacil.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {

      await User.create({
        nome: 'Administrador PãoFácil',
        email: adminEmail,
        senha: 'admin',
        role: 'admin',
        is_verified: true
      });
      console.log('✅ Usuário admin criado com sucesso!');
      console.log(`Email: ${adminEmail}`);
      console.log(`Senha: admin`);
    } else {
      console.log('⚠️ Usuário admin já existe no banco de dados.');
    }

    const { Product } = require('../models');
    const productsCount = await Product.count();
    
    if (productsCount === 0) {
      await Product.bulkCreate([
        { nome: 'Pão Francês', descrição: 'Pão quentinho e crocante direto do forno.', preço: 0.75, disponível: true, imagem: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=500&q=80' },
        { nome: 'Pão de Queijo', descrição: 'Legítima receita tradicional mineira.', preço: 2.50, disponível: true, imagem: 'https://images.unsplash.com/photo-1595116768393-27eb660d5bfa?w=500&q=80' },
        { nome: 'Bolo de Cenoura', descrição: 'Bolo fofinho com cobertura de chocolate.', preço: 15.00, disponível: true, imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
        { nome: 'Coxinha de Frango', descrição: 'Massa super crocante e recheio cremoso.', preço: 6.50, disponível: true, imagem: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' },
        { nome: 'Croissant Gourmet', descrição: 'Receita francesa clássica, folhado e amanteigado.', preço: 8.90, disponível: true, imagem: 'https://images.unsplash.com/photo-1555507036-ab1e4006aa42?w=500&q=80' }
      ]);
      console.log('✅ Catálogo de padaria populado (5 produtos).');
    }

  } catch (error) {
    console.error('❌ Erro ao rodar seed do admin:', error);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
