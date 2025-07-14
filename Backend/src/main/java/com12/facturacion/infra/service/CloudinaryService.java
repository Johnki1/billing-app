package com12.facturacion.infra.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private Cloudinary cloudinary;

    public CloudinaryService(@Value("${cloudinary.url}") String cloudinaryUrl) {
        this.cloudinary = new Cloudinary(cloudinaryUrl);
        this.cloudinary.config.secure = true;
    }

    public String uploadImage(MultipartFile image) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
            return (String) uploadResult.get("url");
        } catch (IOException e) {
            throw new RuntimeException("Error al subir la imagen a Cloudinary", e);
        }
    }

    public String getImageUrl(String publicId) {
        try {
            Map<String, Object> resource = cloudinary.api().resource(publicId, ObjectUtils.emptyMap());
            return (String) resource.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Error al obtener la imagen desde Cloudinary", e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
