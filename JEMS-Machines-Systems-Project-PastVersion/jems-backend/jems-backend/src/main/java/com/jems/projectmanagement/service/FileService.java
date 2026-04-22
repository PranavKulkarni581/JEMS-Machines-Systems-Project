import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveFile(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        File destination = new File(dir, fileName);
        file.transferTo(destination);

        return fileName;
    }
}