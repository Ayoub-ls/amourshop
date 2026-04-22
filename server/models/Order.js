const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'Processing',
  },
  shipping_address: {
    type: Object,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  }
}, {
  timestamps: true,
});

orderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
orderSchema.set('toJSON', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
