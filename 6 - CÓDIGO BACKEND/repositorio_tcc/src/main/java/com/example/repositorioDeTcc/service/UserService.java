package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.UserDTO;
import com.example.repositorioDeTcc.dto.UserForListDTO;
import com.example.repositorioDeTcc.exception.ResourceNotFoundException;
import com.example.repositorioDeTcc.model.User;
import com.example.repositorioDeTcc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails user = userRepository.findByEmail(email);

        if (user == null){
            user = userRepository.findByMatricula(email);
        }
        if (user == null){
            throw new UsernameNotFoundException("User not found with username " + email);
        }
        return user;
    }

    @Transactional(readOnly = true)
    public UserForListDTO findById(UUID id){
        Optional<User> obj = userRepository.findById(id);
        UserForListDTO dto = new UserForListDTO(obj.orElseThrow(() -> new ResourceNotFoundException(id)));
        return dto;
    }
    
    @Transactional(readOnly = true)
    public List<UserForListDTO> findAll(){
        List<User> list = userRepository.findAll().stream().map((detail) -> (User) detail).collect(Collectors.toList());
        List<UserForListDTO> listDto = list.stream().map(user -> new UserForListDTO(user)).toList();
        return listDto;
    }

    public void delete(UUID id){
        if(!userRepository.existsById(id)) throw new ResourceNotFoundException(id);

        userRepository.deleteById(id);
    }

    @Transactional
    public UserDTO update(UUID id, UserDTO obj){
        if(!userRepository.existsById(id)) throw new ResourceNotFoundException(id);

        User entity = userRepository.getReferenceById(id);
        updateData(entity, obj);
        return new UserDTO(userRepository.save(entity));
    }

    private void updateData(User entity, UserDTO obj) {
        entity.setNomeCompleto(obj.getNomeCompleto());
        entity.setEmail(obj.getEmail());
        entity.setEnabled(obj.getEnabled());
        entity.setMustChangePassword(obj.getMustChangePassword());
    }
    

}
