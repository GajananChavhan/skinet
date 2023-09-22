using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseAPIController
    {
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;

        public ProductsController(IGenericRepository<Product> productRepository,
            IGenericRepository<ProductBrand> productBrandRepo,
            IGenericRepository<ProductType> productTypeRepo, IMapper mapper)
        {
            _productRepository = productRepository;
            _productBrandRepo = productBrandRepo;
            _productTypeRepo = productTypeRepo;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery]ProductSpecParams productParams)
        {
            var specification = new ProductsWithTypesAndBrandsSpecification(productParams);
            var products = await _productRepository.GetListAsync(specification).ConfigureAwait(false);
            var countSpecification = new ProductWithFiltersForCountSpecification(productParams);
            var count = await _productRepository.GetCountAsync(countSpecification).ConfigureAwait(false);
            var productsToReturn = _mapper.Map<IReadOnlyList<ProductToReturnDto>>(products);
            var paginatedDate = new Pagination<ProductToReturnDto>(productParams.PageSize, productParams.PageIndex, count, productsToReturn);
            return Ok(paginatedDate);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(statusCode: StatusCodes.Status200OK)]
        [ProducesResponseType(statusCode: StatusCodes.Status404NotFound, type: typeof(ApiResponse))]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var specification = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _productRepository.GetEntityWithSpecification(specification).ConfigureAwait(false);
            if(product == null)
            {
                return NotFound(new ApiResponse(404));
            }
            var productToReturn = _mapper.Map<ProductToReturnDto>(product);
            return Ok(productToReturn);
        }
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProductBrands()
        {
            var brands = await _productBrandRepo.ListAllAsync().ConfigureAwait(false);
            return Ok(brands);
        }
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<Product>>> GetProductTypes()
        {
            var types = await _productTypeRepo.ListAllAsync().ConfigureAwait(false);
            return Ok(types);
        }
    }
}
