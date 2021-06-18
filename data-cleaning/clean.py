import pyspark.sql.functions as F

df = spark.read.csv('newcountries.csv', header=True)

df.replace({
    'Congo (the Democratic Republic of the)': 'Democratic Republic of Congo', 
    'Korea (Democratic People\'s Republic of)': 'North Korea', 
    'Korea (the Republic of)': 'South Korea', 
    'Lao People\'s Democratic Republic': 'Laos', 
    'Russian Federation': 'Russia', 
    'Viet Nam': 'Vietnam', 
    'Palestine, State of': 'Palestine', 
    'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom', 
    'Syrian Arab Republic': 'Syria', 
    'Brunei Darussalam': 'Brunei'
}).selectExpr(
    "regexp_replace(country_name, ' \\\\(.*\\\\)', '') country", 
    "regexp_replace(country_border_name, ' \\\\(.*\\\\)', '') neighbour"
).groupBy('country').agg(
    F.collect_list('neighbour').alias('neighbours')
).orderBy('country').coalesce(1).write.json('newcountries')
