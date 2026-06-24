package repository

import (
	"backend/internal/domain"
	"gorm.io/gorm"
)

type blockRepository struct {
	db *gorm.DB
}

func NewBlockRepository(db *gorm.DB) domain.BlockRepository {
	return &blockRepository{db}
}

// Create salva um novo Bloco no banco.
func (r *blockRepository) Create(block *domain.Block) error {
	return r.db.Create(block).Error
}

// FindAllByUserID traz todos os blocos de um usuário específico,
// junto com os Itens dentro desse bloco (Eager Loading do GORM usando Preload).
// Equivalente ao PHP: Block::with('items')->where('user_id', $userId)->get();
func (r *blockRepository) FindAllByUserID(userID uint) ([]domain.Block, error) {
	var blocks []domain.Block
	err := r.db.Preload("Items").Where("user_id = ?", userID).Find(&blocks).Error
	return blocks, err
}

// FindByID busca um bloco específico de um usuário.
// Passar o userID aqui é uma trava de segurança essencial (para não acessar blocos de outros).
func (r *blockRepository) FindByID(id uint, userID uint) (*domain.Block, error) {
	var block domain.Block
	err := r.db.Preload("Items").Where("id = ? AND user_id = ?", id, userID).First(&block).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &block, nil
}

// Update salva as alterações de um Bloco.
func (r *blockRepository) Update(block *domain.Block) error {
	return r.db.Save(block).Error
}

// Delete exclui um bloco. O GORM configurado com OnDelete:CASCADE apagará os itens filhos no banco.
func (r *blockRepository) Delete(id uint, userID uint) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Block{}).Error
}
