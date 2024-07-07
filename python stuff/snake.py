import pygame
import numpy as np

from Snake_player import Snake




if __name__ == "__main__":
    pygame.init()
    pygame.display.set_caption("Snake")
    surface = pygame.display.set_mode((800, 600))
    clock = pygame.time.Clock()
    
    snake = Snake(surface.get_width()//2, surface.get_height()//2, 3, "left")
    
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
        
        surface.fill((202, 202, 202))  # Clear the screen at the start of each frame
        snake.draw(surface)  # Draw the snake each frame outside the event loop
       
        # pygame.draw.rect(surface, (0,255,0), pygame.Rect(200, 200, 20, 20))
        
        
        
        pygame.display.update()
        clock.tick(60)