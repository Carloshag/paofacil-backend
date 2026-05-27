const { Address, User } = require('../models');

const getAddress = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }
    const address = await Address.findOne({ where: { user_id: req.user.id } });
    return res.status(200).json(address);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar endereço.' });
  }
};

const saveAddress = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }
    
    const { rua, numero, bairro, cidade, cep, lat, lng } = req.body;
    let address = await Address.findOne({ where: { user_id: req.user.id } });

    if (address) {
      address = await address.update({ rua, numero, bairro, cidade, cep, lat, lng });
    } else {
      address = await Address.create({
        user_id: req.user.id, rua, numero, bairro, cidade, cep, lat, lng
      });
    }
    return res.status(200).json(address);
  } catch (error) {
    console.error('Erro ao salvar endereço do usuário:', error);
    return res.status(500).json({ error: 'Erro no DB: ' + error.message });
  }
};

const getDeliveryEstimate = async (req, res) => {
  try {
    const customerAddress = await Address.findOne({ where: { user_id: req.user.id } });
    if (!customerAddress || !customerAddress.lat) {
      return res.status(400).json({ error: 'Endereço do cliente não encontrado.' });
    }

    const admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      return res.status(400).json({ error: 'Nenhum administrador cadastrado.' });
    }

    const storeAddress = await Address.findOne({ where: { user_id: admin.id } });
    if (!storeAddress || !storeAddress.lat) {
      return res.status(400).json({ error: 'Endereço da loja não configurado.' });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const routeBody = {
      origin: { location: { latLng: { latitude: storeAddress.lat, longitude: storeAddress.lng } } },
      destination: { location: { latLng: { latitude: customerAddress.lat, longitude: customerAddress.lng } } },
      travelMode: 'DRIVE',
      languageCode: 'pt-BR'
    };

    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.localizedValues'
      },
      body: JSON.stringify(routeBody)
    });
    const data = await response.json();

    console.log('Routes API response:', JSON.stringify(data, null, 2));

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = (route.distanceMeters / 1000).toFixed(1);
      const durationSecs = parseInt(route.duration);
      const durationMin = Math.ceil(durationSecs / 60);

      return res.status(200).json({
        distance: `${distanceKm} km`,
        duration: `${durationMin} min`,
        storeAddress: `${storeAddress.rua}, ${storeAddress.numero} - ${storeAddress.bairro}`
      });
    } else {
      return res.status(400).json({ error: data.error?.message || 'Não foi possível calcular a rota. Habilite a Routes API no Google Cloud Console.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao calcular estimativa.', details: error.message });
  }
};

module.exports = { getAddress, saveAddress, getDeliveryEstimate };
