package br.com.abeel.abeel.config;

import br.com.abeel.abeel.entity.Role;
import br.com.abeel.abeel.entity.User;
import br.com.abeel.abeel.repository.RoleRepository;
import br.com.abeel.abeel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Set;

@Configuration
public class AdminUserConfig implements CommandLineRunner {

    @Autowired
    private UserRepository ur;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository rr;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        var userAdmin = ur.findByUsername(adminUsername);
        var roleAdmin = rr.findByNome(Role.Values.ADMIN.name());

        if(roleAdmin == null){
            roleAdmin = new Role();
            roleAdmin.setNome(Role.Values.ADMIN.name());
            rr.save(roleAdmin);
        }

        final Role role = roleAdmin;

        userAdmin.ifPresentOrElse(
                user -> {
                    System.out.println("Admin ja existe");
                },
                () -> {
                    var user = new User();
                    user.setUsername(adminUsername);
                    user.setPassword(passwordEncoder.encode(adminPassword));
                    user.setRole(Set.of(role));
                    ur.save(user);
                }
        );

    }
}
