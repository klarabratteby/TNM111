import csv
import tkinter as tk
from tkinter import ttk
import math
import numpy as np

# List for colors
COLORS = ["red", "pink", "green"]
# List for shapes
SHAPES = ['circle', 'square', 'star']

# Class to represent a data point
class DataPoint:
    def __init__(self, x, y, category):
        self.x = x
        self.y = y # negative if flip y-axis
        self.category = category

# Read data from csv-file
def read_data(file_path):
    with open(file_path, 'r') as file:
        csvreader = csv.reader(file)
        data = [DataPoint(float(row[0]), float(row[1]), row[2])
                for row in csvreader]
    return data

# Class for creating a Scatter Plot
class ScatterPlot:
    
    # Initializer
    def __init__(self, root, data):
        self.root = root  # main window
        self.data = data  # data
        self.canvas = tk.Canvas(root, width=800, height=800)  # Tkinter widget
        self.canvas.pack()  # packs the canvas within the main window
        self.translated = False
        self.highlighted = False
        self.new_grid = [0,0] # New grid
        self.closest_points = [] # For highlighting
        self.original_positions = {}  # Original positions + color for each point
        #self.x_range, self.y_range = self.calculate_axis_ranges()  # Add x_range and y_range as attributes

    # Draw the x- and y-axis and the ticks and tick values.
    def draw_axes_ticks(self):
        self.draw_axis_lines()
        self.draw_ticks()

    def draw_axis_lines(self):
        # Draw x-axis
        self.canvas.create_line(50, 400, 750, 400, fill="black", width=2)
        self.canvas.create_text(750, 350, text="X-axis")

        # Draw y-axis
        self.canvas.create_line(400, 750, 400, 50, fill="black", width=2)
        self.canvas.create_text(350, 50, text="Y-axis")

    def draw_ticks(self):
        x_range, y_range = self.calculate_axis_ranges()

        # Convert x_range and y_range to integers
        x_range = int(x_range)
        y_range = int(y_range)
        
        # Draw ticks and tick values on x-axis
        for i in range(-x_range, x_range+1, round(x_range*2/11)):
            x = round(400 + i*(350/x_range))
            self.canvas.create_line(x, 390, x, 410, width=1)
            self.canvas.create_text(round(x), 425, text=str(i))

        # Draw ticks and tick values on y-axis
        for i in range(-y_range, y_range+1, round(y_range*2/11)):
            y = round(400 - i*(350/y_range))
            self.canvas.create_line(390, y, 410, y, width=1)
            self.canvas.create_text(425, y, text=str(i))

    def calculate_axis_ranges(self):
        x_values = [point.x for point in self.data if point.x is not None]
        y_values = [point.y for point in self.data if point.y is not None]

        x_min = min(map(float, x_values), default=0)
        x_max = max(map(float, x_values), default=0)
        y_min = min(map(float, y_values), default=0)
        y_max = max(map(float, y_values), default=0)

        x_range = max(abs(x_min), abs(x_max))
        y_range = max(abs(y_min), abs(y_max))

        return x_range, y_range

    # Draw legend
    def draw_legend(self, types):
        for i in range(len(types)):
            shape = SHAPES[i] if i < len(SHAPES) else 'unknown'
            tk.Label(self.root, text=f"{shape} : {types[i]}").place(
                relx=0.95, rely=0.1 + 0.05 * i, anchor="ne")
   
    # Draw a data point with specified color, shape, and category
    def draw_data_points(self, x, y, color, shape, category):
        if shape == 'circle':
            element = self.canvas.create_oval(
                x - 5, y - 5, x + 5, y + 5, fill=color, tags=["point", f"{shape}"])
        elif shape == 'square':
            element = self.canvas.create_rectangle(
                x - 5, y - 5, x + 5, y + 5, fill=color, tags=["point", f"{shape}"])
        elif shape == 'star':
            element = self.canvas.create_text(x, y, text="*", fill=color, font=("Purisa", 30),
                                              tags=["point", f"{shape}"])
        else:
            element = None
        
        self.canvas.tag_bind(element, '<Button-1>', self.left_click) # Left click
        self.canvas.tag_bind(element, '<Control-Button-1>', self.right_click) # Right click

        return element

    # Display the data points and categorical information
    def display_data_points(self):
        x_range, y_range = self.calculate_axis_ranges()
        types = set(map(lambda point: point.category, self.data))
        types = list(types)

        # Calculate coordinates based on data point and axis ranges
        for point in self.data:
            x = round(400 + point.x * (350 / x_range))
            y = round(400 - point.y * (350 / y_range)) # flipped

            # Get the color and shape based on the category
            if point.category in types:
                color = COLORS[types.index(point.category)]
                shape = SHAPES[types.index(point.category)]
            
            point_tag = f"point_{point.category}"  # Use a unique tag for each point
            self.draw_data_points(x, y, color, shape, point_tag)
    
    # Left-clicking feature
    def left_click(self, event):
        points = self.canvas.find_withtag("point")

        if self.translated:
            self.translated = False
            # If translated, move all points back to original
            for point_tag in points:
                original_position, original_color = self.original_positions[point_tag]
                self.canvas.coords(point_tag, original_position)
                self.canvas.itemconfig(point_tag, fill=original_color)
            #print("Original Positions:", self.original_positions)  
            
        else:
            # If not translated
            self.translated = True
            # Move points to create a new grid system with the selected point as the origin
            move_x = 400-event.x
            move_y = 400-event.y
            self.new_grid = [move_x, move_y]

            # Store the original positions and colors before the translation
            for point_tag in points:
                original_color = self.canvas.itemcget(point_tag, "fill")
                original_position = self.canvas.coords(point_tag)
                self.original_positions[point_tag] = (original_position, original_color)

            
            # Loop through all points with tag "point"
            for i in range(len(points)):
                # Move the point to the new position in the grid system
                self.canvas.move(points[i], move_x, move_y)

                p = self.canvas.coords(points[i])
            
                if p[0] > 400 and p[1] > 400:
                    colorTag = "red"
                elif p[0] > 400 and p[1] < 400:
                    colorTag = "purple"
                elif p[0] < 400 and p[1] < 400:
                    colorTag = "yellow"
                elif p[0] < 400 and p[1] > 400:
                    colorTag = "orange"
                self.canvas.itemconfig(points[i], fill=colorTag)

            current = event.widget.find_withtag("current")[0]
            self.canvas.itemconfig(current, fill='black')
    
    # Right-clicking feature
    def right_click(self, event):
        points = self.canvas.find_withtag("point")

        if self.highlighted:
            self.highlighted = False
            # If already highlighted, reset highlighted points
            for point_tag in self.closest_points:
                if point_tag in self.original_positions:
                    original_position, original_color = self.original_positions[point_tag]
                    self.canvas.coords(point_tag, original_position)
                    self.canvas.itemconfig(point_tag, fill=original_color)
            #print("Original Positions:", self.original_positions)
        else:
            # Check if there are any currently selected points
            if self.closest_points:
                # Turn off the highlighting for selected points
                for point_tag in self.closest_points:
                    if point_tag in self.original_positions:
                        original_color = self.original_positions[point_tag][1]
                        self.canvas.itemconfig(point_tag, fill=original_color)
                self.closest_points = []
            else:
                # If not highlighted, turn on the highlighting
                self.highlighted = True
                active = [event.x, event.y]

                # Find closest points
                dist = []
                for point_tag in points:
                    if "point" in self.canvas.gettags(point_tag):  # Ensure it's a data point
                        co = self.canvas.coords(point_tag)
                        d = math.sqrt(pow((active[0] - co[0]), 2) + pow((active[1] - co[1]), 2))

                        if d > 0:
                            dist.append((d, point_tag))

                closest_points = sorted(dist, key=lambda x: x[0])[:5]

                # Get 5 smallest distances
                self.closest_points = []

                # Store closest points and highlight them
                for _, point_tag in closest_points:
                    if "point" in self.canvas.gettags(point_tag): 
                        # Store the original position and color
                        if point_tag not in self.original_positions:
                            original_color = self.canvas.itemcget(point_tag, "fill")
                            original_position = self.canvas.coords(point_tag)
                            self.original_positions[point_tag] = (original_position, original_color)
                        
                        # Highlight data point
                        self.canvas.itemconfig(point_tag, fill='black')
                        self.closest_points.append(point_tag)
        
       
if __name__ == "__main__":
    file_path = input(
        "Enter the CSV file path: ")
    data = read_data(file_path)

    # Create the Tkinter window
    root = tk.Tk()
    root.title("Scatter Plot")

    scatter_plot = ScatterPlot(root, data)
    scatter_plot.draw_axes_ticks()

    types = list(set([point.category for point in data]))
    scatter_plot.draw_legend(types)
    scatter_plot.display_data_points()

    root.mainloop()
