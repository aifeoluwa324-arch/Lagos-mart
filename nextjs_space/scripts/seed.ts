import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hidden test account
  const testHash = await bcrypt.hash('4@cec6oJWT', 10)
  await prisma.user.upsert({
    where: { email: 'abacus-30254e75@example.com' },
    update: {},
    create: { email: 'abacus-30254e75@example.com', name: 'Test Admin', password: testHash, role: 'ADMIN' },
  })

  // Demo accounts
  const adminHash = await bcrypt.hash('Admin123', 10)
  const managerHash = await bcrypt.hash('Manager123', 10)
  const officerHash = await bcrypt.hash('Officer123', 10)

  await prisma.user.upsert({ where: { email: 'admin@lagosmart.com' }, update: {}, create: { email: 'admin@lagosmart.com', name: 'Samuel Adeyemi', password: adminHash, role: 'ADMIN' } })
  await prisma.user.upsert({ where: { email: 'manager@lagosmart.com' }, update: {}, create: { email: 'manager@lagosmart.com', name: 'Chioma Okafor', password: managerHash, role: 'STORE_MANAGER' } })
  await prisma.user.upsert({ where: { email: 'officer@lagosmart.com' }, update: {}, create: { email: 'officer@lagosmart.com', name: 'Emeka Nwosu', password: officerHash, role: 'STOCK_OFFICER' } })

  // Categories
  const cats = ['Grains & Cereals', 'Beverages', 'Dairy', 'Canned Goods', 'Household', 'Snacks', 'Toiletries', 'Condiments']
  const catRecords: any = {}
  for (const name of cats) {
    catRecords[name] = await prisma.category.upsert({ where: { name }, update: {}, create: { name } })
  }

  // Suppliers
  const suppliers = [
    { name: 'Dangote Industries', email: 'supply@dangote.com', phone: '08012345678', address: 'Ikeja, Lagos' },
    { name: 'Dufil Prima Foods', email: 'sales@dufil.com', phone: '08023456789', address: 'Apapa, Lagos' },
    { name: 'FrieslandCampina', email: 'info@friesland.ng', phone: '08034567890', address: 'Victoria Island, Lagos' },
    { name: 'Chi Limited', email: 'orders@chi.com', phone: '08045678901', address: 'Ajao Estate, Lagos' },
    { name: 'PZ Cussons', email: 'supply@pzcussons.ng', phone: '08056789012', address: 'Ilupeju, Lagos' },
  ]
  const supRecords: any[] = []
  for (const s of suppliers) {
    const r = await prisma.supplier.upsert({ where: { id: s.name.replace(/\s+/g, '-').toLowerCase() }, update: {}, create: { id: s.name.replace(/\s+/g, '-').toLowerCase(), ...s } })
    supRecords.push(r)
  }

  // Products
  const products = [
    { name: 'Rice (50kg)', sku: 'LM-001', price: 85000, quantity: 20, minStock: 5, cat: 'Grains & Cereals', sup: 0 },
    { name: 'Vegetable Oil (5L)', sku: 'LM-002', price: 12500, quantity: 5, minStock: 10, cat: 'Condiments', sup: 0 },
    { name: 'Sugar (50kg)', sku: 'LM-003', price: 45000, quantity: 35, minStock: 5, cat: 'Grains & Cereals', sup: 0 },
    { name: 'Indomie Noodles (carton)', sku: 'LM-004', price: 8500, quantity: 0, minStock: 15, cat: 'Snacks', sup: 1 },
    { name: 'Garri (50kg)', sku: 'LM-005', price: 28000, quantity: 40, minStock: 10, cat: 'Grains & Cereals', sup: 0 },
    { name: 'Peak Milk (carton)', sku: 'LM-006', price: 15000, quantity: 8, minStock: 10, cat: 'Dairy', sup: 2 },
    { name: 'Golden Penny Flour (50kg)', sku: 'LM-007', price: 42000, quantity: 15, minStock: 5, cat: 'Grains & Cereals', sup: 0 },
    { name: 'Milo (900g)', sku: 'LM-008', price: 5500, quantity: 25, minStock: 10, cat: 'Beverages', sup: 3 },
    { name: 'Bournvita (900g)', sku: 'LM-009', price: 5200, quantity: 3, minStock: 10, cat: 'Beverages', sup: 3 },
    { name: 'Dettol Soap (pack)', sku: 'LM-010', price: 3500, quantity: 50, minStock: 15, cat: 'Toiletries', sup: 4 },
    { name: 'Tomato Paste (carton)', sku: 'LM-011', price: 18000, quantity: 12, minStock: 8, cat: 'Canned Goods', sup: 1 },
    { name: 'Palm Oil (25L)', sku: 'LM-012', price: 35000, quantity: 7, minStock: 5, cat: 'Condiments', sup: 0 },
    { name: 'Omo Detergent (5kg)', sku: 'LM-013', price: 6500, quantity: 30, minStock: 10, cat: 'Household', sup: 4 },
    { name: 'Spaghetti (carton)', sku: 'LM-014', price: 9500, quantity: 22, minStock: 10, cat: 'Grains & Cereals', sup: 1 },
    { name: 'Sardine (carton)', sku: 'LM-015', price: 12000, quantity: 0, minStock: 10, cat: 'Canned Goods', sup: 1 },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        name: p.name, sku: p.sku, price: p.price, quantity: p.quantity, minStock: p.minStock,
        categoryId: catRecords[p.cat]?.id ?? null,
        supplierId: supRecords[p.sup]?.id ?? null,
      },
    })
  }

  // Sample stock movements
  const allProducts = await prisma.product.findMany()
  for (const product of allProducts.slice(0, 6)) {
    await prisma.stockMovement.create({ data: { productId: product.id, type: 'STOCK_IN', quantity: 50, note: 'Initial stock' } })
    await prisma.stockMovement.create({ data: { productId: product.id, type: 'STOCK_OUT', quantity: 10, note: 'Customer purchase' } })
  }

  // Sample sales
  const riceProduct = allProducts.find((p: any) => p.sku === 'LM-001')
  const sugarProduct = allProducts.find((p: any) => p.sku === 'LM-003')
  if (riceProduct && sugarProduct) {
    await prisma.sale.create({
      data: {
        total: riceProduct.price * 2 + sugarProduct.price,
        customerName: 'Mrs. Adebayo',
        items: {
          create: [
            { productId: riceProduct.id, quantity: 2, price: riceProduct.price },
            { productId: sugarProduct.id, quantity: 1, price: sugarProduct.price },
          ],
        },
      },
    })
  }

  console.log('Seed complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
