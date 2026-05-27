const { Product } = require('../models');

const list = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { disponível: true } });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar produtos.', details: error.message });
  }
};

const listAllAsAdmin = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar produtos.', details: error.message });
  }
};

const create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ message: 'Produto criado com sucesso.', product });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar produto.', details: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRows] = await Product.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const product = await Product.findByPk(id);
    return res.status(200).json({ message: 'Produto atualizado.', product });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar produto.', details: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Product.destroy({ where: { id } });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    return res.status(200).json({ message: 'Produto removido com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao remover produto.', details: error.message });
  }
};

module.exports = { list, listAllAsAdmin, create, update, remove };
