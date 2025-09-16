"""
Serviço para integração com Supabase
"""
import os
from supabase import create_client, Client
from django.conf import settings
import uuid
from datetime import datetime

class SupabaseService:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        self.service_key = settings.SUPABASE_SERVICE_KEY
        self.supabase: Client = create_client(self.url, self.key)
    
    def upload_image(self, file, folder="roupas"):
        """
        Faz upload de uma imagem para o Supabase Storage
        """
        try:
            # Gerar nome único para o arquivo
            file_extension = file.name.split('.')[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            
            # Fazer upload para o Supabase Storage
            response = self.supabase.storage.from_("imagens").upload(
                f"{folder}/{unique_filename}",
                file.read(),
                file_options={"content-type": file.content_type}
            )
            
            if response:
                # Retornar URL pública da imagem
                public_url = self.supabase.storage.from_("imagens").get_public_url(f"{folder}/{unique_filename}")
                return public_url
            else:
                return None
                
        except Exception as e:
            print(f"Erro ao fazer upload da imagem: {e}")
            return None
    
    def create_roupa(self, roupas_data):
        """
        Cria uma nova roupa no Supabase
        """
        try:
            response = self.supabase.table("roupas").insert(roupas_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Erro ao criar roupa: {e}")
            return None
    
    def get_roupas(self):
        """
        Busca todas as roupas ativas do Supabase
        """
        try:
            response = self.supabase.table("roupas").select("*").eq("ativo", True).execute()
            return response.data
        except Exception as e:
            print(f"Erro ao buscar roupas: {e}")
            return []
    
    def get_roupa_by_id(self, roupas_id):
        """
        Busca uma roupa específica por ID
        """
        try:
            response = self.supabase.table("roupas").select("*").eq("id", roupas_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Erro ao buscar roupa: {e}")
            return None
    
    def update_roupa(self, roupas_id, roupas_data):
        """
        Atualiza uma roupa no Supabase
        """
        try:
            response = self.supabase.table("roupas").update(roupas_data).eq("id", roupas_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Erro ao atualizar roupa: {e}")
            return None
    
    def delete_roupa(self, roupas_id):
        """
        Marca uma roupa como inativa (soft delete)
        """
        try:
            response = self.supabase.table("roupas").update({"ativo": False}).eq("id", roupas_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Erro ao deletar roupa: {e}")
            return None
    
    def delete_image(self, image_path):
        """
        Remove uma imagem do Supabase Storage
        """
        try:
            # Extrair o caminho da imagem da URL
            if "imagens/" in image_path:
                file_path = image_path.split("imagens/")[-1]
                response = self.supabase.storage.from_("imagens").remove([file_path])
                return response
            return None
        except Exception as e:
            print(f"Erro ao deletar imagem: {e}")
            return None
