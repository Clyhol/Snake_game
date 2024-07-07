import pygame
from collections import namedtuple

BodyPart = namedtuple("BodyPart", "x y")

class Snake:
    def __init__(self, x, y, startLength, direction):
        self.x = x
        self.y = y
        self.startLength = startLength
        self.direction = direction
        self.width = 20
        self.height = 20
        self.body = []
        self.color = (0, 255, 0)
        
        for i in range(self.startLength):
            self.body.append(BodyPart(self.x - self.width * i, self.y))
            
    def draw(self, window):
        for part in self.body:
            rect = pygame.Rect(part.x, part.y, self.width, self.height)
            pygame.draw.rect(window, self.color, rect)
            border = rect.inflate(2,2)
            pygame.draw.rect(window, (0,0,0), border, 2)
            
    def move(self):
        head = self.body[0]
        new_head = None
        if (self.direction == "right"):
            new_head = BodyPart(head.x + self.width, head.y)
        if (self.direction == "left"):
            new_head = BodyPart(head.x - self.width, head.y)
        if (self.direction == "up"):
            new_head = BodyPart(head.x, head.y + self.height)
        if (self.direction == "left"):
            new_head = BodyPart(head.x, head.y - self.height)

        self.body.insert(0, new_head)
        self.body.pop()
        
            

            
if __name__ == "__main__":
    pygame.init()
    surface = pygame.display.set_mode((800, 600))
    snake = Snake(surface.get_width()//2, surface.get_height()//2, 3, "right")
    
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
        surface.fill((202, 202, 202))
        snake.draw(surface)
        pygame.display.update()

        
        
