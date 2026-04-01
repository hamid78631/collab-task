package com.example.collab;

import com.example.collab.entities.*;
import com.example.collab.enums.EnumPriority;
import com.example.collab.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.stream.Stream;

@SpringBootApplication
public class CollabApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollabApplication.class, args);
	}
	
    @Bean
    CommandLineRunner init(UserRepository userRepository,
                           WorkspaceRepository workspaceRepository,
                           BoardRepository boardRepository,
                           TaskColumnRepository taskColumnRepository,
                           TaskRepository taskRepository,
                           CommentRepository commentRepository,
                           NotificationRepository notificationRepository) {

        return args -> {
            Stream.of("hassan", "hamid", "youssef").forEach(name -> {
                User user = new User();
                user.setName(name);
                user.setEmail(name + "@gmail.com");
                user.setPassword("12345");
                user.setAvatarUrl("https://avatars.githubusercontent.com/u/456?v=4");
                userRepository.save(user);
            });


            userRepository.findAll().forEach(user -> {

                Workspace workspace = new Workspace();
                workspace.setName("Workspace de " + user.getName());
                workspace.setSlug("slug-" + user.getName());
                workspace.setOwner(user);
                workspace.setDescription("desc");
                workspaceRepository.save(workspace);

                Board board = new Board();
                board.setTitle("Projet PFE");
                board.setBackgroundColor("green");
                board.setWorkspace(workspace);
                boardRepository.save(board);


                TaskColumn column = new TaskColumn();
                column.setName("To Do");
                column.setBoard(board);
                column.setPosition(1);
                taskColumnRepository.save(column);


                Task task = new Task();
                task.setTitle("Finir le backend");
                task.setDescription("description de la tâche");
                task.setPriority(EnumPriority.HIGH);
                task.setTaskColumn(column);
                task.setAssignee(user);
                task.setPosition(1);
                taskRepository.save(task);

                Comment comment = new Comment();
                comment.setAuthor(user);
                comment.setContent("C'est parti pour le code !");
                comment.setTask(task);
                commentRepository.save(comment);

                //Notifications de tests
                Notification n1 = new Notification();
                n1.setMessage("Bienvenue sur FlowBoard, " + user.getName() + " !");
                n1.setCreatedAt(java.time.LocalDateTime.now());
                n1.setRead(false);
                n1.setType("WELCOME");
                n1.setOwnerNotification(user);
                notificationRepository.save(n1);

                Notification n2 = new Notification();
                n2.setMessage("Une nouvelle tâche vous a été assignée : Finir le backend");
                n2.setCreatedAt(java.time.LocalDateTime.now().minusMinutes(10));
                n2.setRead(false);
                n2.setType("TASK_ASSIGNED");
                n2.setOwnerNotification(user);
                notificationRepository.save(n2);
            });

            System.out.println("--- TEST DE RELATION TERMINE AVEC SUCCÈS ---");
        };
    }
}


