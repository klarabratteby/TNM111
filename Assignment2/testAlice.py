# -*- coding: utf-8 -*-

import csv
import tkinter as tk

COLORS = ["red", "pink", "green"]
SHAPES = ['circle', 'square', 'star']


class DataPoint:
    def __init__(self, x, y, category):
        self.x = x
        self.y = y
        self.category = category

# Read csv files

    def read_data(file_path):
        with open(file_path, 'r') as file:
            csvreader = csv.reader(file)
            data = [DataPoint(float(row[0]), float(row[1]), row[2])
                    for row in csvreader]
        return data

    def convert_to_float(value):
        try:
            return float(value)
        except ValueError:
            return None


class ScatterPlot:
    # Initializer
    def __init__(self, root, data):
        self.root = root  # main window
        self.data = data  # data
        self.canvas = tk.Canvas(root, width=800, height=800)  # Tkinter widget
        self.canvas.pack()  # packs the canvas within the main window
        self.selected_point = None
        self.new_origin = False
        self.neighbor_highlighted = False
        self.closest_points = []

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
            tk.Label(self.root, text="{} : {}".format(shape, types[i])).place(
                relx=0.95, rely=0.1 + 0.05 * i, anchor="ne")
    # Draw a data point with specified color, shape, and category

    def draw_data_points(self, x, y, color, shape, category):
        if shape == 'circle':
            element = self.canvas.create_oval(
                x - 5, y - 5, x + 5, y + 5, fill=color, tags=["point", "{}".format(shape)])
        elif shape == 'square':
            element = self.canvas.create_rectangle(
                x - 5, y - 5, x + 5, y + 5, fill=color, tags=["point", "{}".format(shape)])
        elif shape == 'star':
            element = self.canvas.create_text(x, y, text="*", fill=color, font=("Purisa", 30),
                                              tags=["point", "{}".format(shape)])
        else:
            element = None

        return element

    # Display the data points and categorical information
    def display_data_points(self):
        x_range, y_range = self.calculate_axis_ranges()
        types = set(map(lambda point: point.category, self.data))
        types = list(types)

        for point in self.data:
            x = round(400 + point.x * (350 / x_range))
            y = round(400 - point.y * (350 / y_range))
            color = 'black'  # default color
            shape = 'circle'  # default shape

            if point.category in types:
                color = COLORS[types.index(point.category)]
                shape = SHAPES[types.index(point.category)]

            self.draw_data_points(x, y, color, shape, point.category)
            self.canvas.tag_bind(point.category, '<Button-1>', lambda event,
                                 tag=point.category: self.left_click_event(event, tag))
            self.canvas.tag_bind(point.category, '<Button-3>', lambda event,
                                 tag=point.category: self.right_click_event(event, tag))


if __name__ == "__main__":
    file_path = input("Enter the CSV file path: ")
    data = DataPoint.read_data(file_path)  # Använda den som en statisk metod

    root = tk.Tk()
    root.title("Scatter Plot")

    scatter_plot = ScatterPlot(root, data)
    scatter_plot.draw_axes_ticks()

    types = list(set([point.category for point in data]))
    scatter_plot.draw_legend(types)
    scatter_plot.display_data_points()

    root.mainloop()
