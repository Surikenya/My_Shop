import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../brand/entities/brand.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { brandId, ...productData } = createProductDto;

    const product = this.productRepository.create(productData);

    if (!product.defaultImage) {
      product.defaultImage = product.image;
    }

    if (brandId) {
      const brand = await this.brandRepository.findOneBy({ id: brandId });
      product.brand = brand ?? null;
    }

    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({
      relations: {
        brand: true,
      },
    });
  }

  findOne(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: {
        brand: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        brand: true,
      },
    });

    if (!product) {
      return null;
    }

    const { brandId, ...productData } = updateProductDto;

    Object.assign(product, productData);

    if (brandId !== undefined) {
      if (brandId === null) {
        product.brand = null;
      } else {
        const brand = await this.brandRepository.findOneBy({ id: brandId });
        product.brand = brand ?? null;
      }
    }

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        brand: true,
      },
    });

    if (!product) {
      return null;
    }

    await this.productRepository.delete(id);
    return product;
  }
}