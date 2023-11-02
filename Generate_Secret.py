import random

def generate_alpha_bike_string(length=32):
  
  alpha_bike_string = "abcdefghijklmnopqrstuvwxyzAZERTYUIOPQSDFGHJKLMWXCVBN"
  alpha_bike_string_list = list(alpha_bike_string)
  random.shuffle(alpha_bike_string_list)
  alpha_bike_string = ''.join(alpha_bike_string_list[:length])
  return alpha_bike_string




  
print(generate_alpha_bike_string())
