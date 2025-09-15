from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

class Roupa(models.Model):
    CATEGORIA_CHOICES = [
        ('vestido', 'Vestido'),
        ('blusa', 'Blusa'),
        ('calca', 'Calça'),
        ('saia', 'Saia'),
        ('conjunto', 'Conjunto'),
        ('acessorios', 'Acessórios'),
    ]
    
    TAMANHO_CHOICES = [
        ('P', 'P'),
        ('M', 'M'),
        ('G', 'G'),
        ('GG', 'GG'),
        ('P,M', 'P, M'),
        ('M,G', 'M, G'),
        ('G,GG', 'G, GG'),
        ('P,M,G', 'P, M, G'),
        ('M,G,GG', 'M, G, GG'),
        ('P,M,G,GG', 'P, M, G, GG'),
    ]
    
    nome = models.CharField(max_length=200, verbose_name="Nome da Roupa")
    descricao = models.TextField(blank=True, null=True, verbose_name="Descrição")
    preco = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name="Preço (R$)"
    )
    categoria = models.CharField(
        max_length=20, 
        choices=CATEGORIA_CHOICES, 
        verbose_name="Categoria"
    )
    tamanhos = models.CharField(
        max_length=20,
        choices=TAMANHO_CHOICES,
        default='P,M,G',
        verbose_name="Tamanhos Disponíveis"
    )
    imagem_principal = models.ImageField(
        upload_to='roupas/', 
        verbose_name="Imagem Principal"
    )
    imagem_2 = models.ImageField(
        upload_to='roupas/', 
        blank=True, 
        null=True,
        verbose_name="Imagem 2"
    )
    imagem_3 = models.ImageField(
        upload_to='roupas/', 
        blank=True, 
        null=True,
        verbose_name="Imagem 3"
    )
    data_criacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    
    class Meta:
        verbose_name = "Roupa"
        verbose_name_plural = "Roupas"
        ordering = ['-data_criacao']
    
    def __str__(self):
        return self.nome
    
    def get_preco_formatado(self):
        return f"R$ {self.preco:.2f}".replace('.', ',')
    
    def get_categoria_display_pt(self):
        return dict(self.CATEGORIA_CHOICES)[self.categoria]
    
    def get_tamanhos_display(self):
        return dict(self.TAMANHO_CHOICES)[self.tamanhos]
    
    def get_imagens(self):
        """Retorna lista de imagens disponíveis"""
        imagens = []
        if self.imagem_principal:
            imagens.append(self.imagem_principal.url)
        if self.imagem_2:
            imagens.append(self.imagem_2.url)
        if self.imagem_3:
            imagens.append(self.imagem_3.url)
        return imagens
    
    def get_imagem_principal_url(self):
        """Retorna URL da imagem principal ou string vazia"""
        if self.imagem_principal:
            return self.imagem_principal.url
        return ""
