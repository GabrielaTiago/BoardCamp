import categoriesRepositories from '../../repositories/categoriesRespositories.js';
import categoriesServices from '../categoriesServices.js';

jest.mock('../../repositories/categoriesRespositories.js');

const CATEGORY_NAME = 'Estratégia';
const CATEGORY_ID = 1;
const CATEGORY = { id: CATEGORY_ID, name: CATEGORY_NAME };
const CATEGORIES = [CATEGORY];

const NOT_EXISTING_CATEGORY_ID = 999;

const CATEGORY_FOUND = { rowCount: 1, rows: [CATEGORY] };
const CATEGORY_NOT_FOUND = { rowCount: 0, rows: [] };

const CATEGORY_NOT_FOUND_ERROR = {
	type: 'not_found',
	message: 'Category not found',
};

describe('Categories Service', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getCategories', () => {
		it('should return a list of categories', async () => {
			categoriesRepositories.getCategories.mockResolvedValue(CATEGORIES);

			const result = await categoriesServices.getCategories();

			expect(result).toEqual(CATEGORIES);
			expect(categoriesRepositories.getCategories).toHaveBeenCalledTimes(1);
		});

		it('should throw a not found error when no categories are found', async () => {
			categoriesRepositories.getCategories.mockResolvedValue([]);

			const expectedError = { type: 'not_found', message: 'No categories found' };

			await expect(categoriesServices.getCategories()).rejects.toEqual(expectedError);
		});
	});

	describe('createCategory', () => {
		it('should create a new category successfully', async () => {
			const categoryName = 'Estratégia';

			categoriesRepositories.getCategoryByName.mockResolvedValue({ rowCount: 0, rows: [] });
			categoriesRepositories.createCategory.mockResolvedValue();

			await categoriesServices.createCategory(categoryName);

			expect(categoriesRepositories.createCategory).toHaveBeenCalledTimes(1);
			expect(categoriesRepositories.createCategory).toHaveBeenCalledWith(categoryName);
		});

		it('should throw a conflict error if the category name already exists', async () => {
			const expectedError = { type: 'conflict', message: `Category name '${CATEGORY_NAME}' already exists` };

			categoriesRepositories.getCategoryByName.mockResolvedValue(CATEGORY_FOUND);

			await expect(categoriesServices.createCategory(CATEGORY_NAME)).rejects.toEqual(expectedError);
			expect(categoriesRepositories.getCategoryByName).toHaveBeenCalledWith(CATEGORY_NAME);
		});
	});

	describe('updateCategory', () => {
		it('should update a category successfully', async () => {
			const categoryNameToBeUpdated = 'Aventura';

			categoriesRepositories.getCategorieById.mockResolvedValue({ rowCount: 1, rows: [CATEGORY] });
			categoriesRepositories.getCategoryByName.mockResolvedValue({ rowCount: 0, rows: [] });
			categoriesRepositories.updateCategory.mockResolvedValue();

			await categoriesServices.updateCategory(categoryNameToBeUpdated, CATEGORY_ID);

			expect(categoriesRepositories.updateCategory).toHaveBeenCalledTimes(1);
			expect(categoriesRepositories.updateCategory).toHaveBeenCalledWith(categoryNameToBeUpdated, CATEGORY_ID);
		});

		it('should throw a not found error when trying to update a non-existing category', async () => {
			const categoryName = 'Inexistente';

			categoriesRepositories.getCategorieById.mockResolvedValue(CATEGORY_NOT_FOUND);

			await expect(categoriesServices.updateCategory(categoryName, NOT_EXISTING_CATEGORY_ID)).rejects.toEqual(
				CATEGORY_NOT_FOUND_ERROR
			);
		});
	});

	describe('deleteCategory', () => {
		it('should delete a category successfully', async () => {
			categoriesRepositories.getCategorieById.mockResolvedValue(CATEGORY_FOUND);
			categoriesRepositories.deleteCategory.mockResolvedValue();

			await categoriesServices.deleteCategory(CATEGORY_ID);

			expect(categoriesRepositories.deleteCategory).toHaveBeenCalledTimes(1);
			expect(categoriesRepositories.deleteCategory).toHaveBeenCalledWith(CATEGORY_ID);
		});

		it('should throw a not found error when trying to delete a non-existing category', async () => {
			categoriesRepositories.getCategorieById.mockResolvedValue(CATEGORY_NOT_FOUND);

			await expect(categoriesServices.deleteCategory(NOT_EXISTING_CATEGORY_ID)).rejects.toEqual(CATEGORY_NOT_FOUND_ERROR);
		});
	});
});
