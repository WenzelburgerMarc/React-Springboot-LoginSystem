package com.marcwenzelburger.todobackend;

import com.marcwenzelburger.todobackend.entity.Role;
import com.marcwenzelburger.todobackend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TodoBackendApplication {

	private boolean firstRun = true;

	public static void main(String[] args) {
		SpringApplication.run(TodoBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(RoleRepository roleRepo) {
		return (args) -> {
			Role adminRole=new Role();
			adminRole.setName("ROLE_ADMIN");

			Role userRole=new Role();
			userRole.setName("ROLE_USER");

			roleRepo.save(adminRole);
			roleRepo.save(userRole);
		};
	}
}
