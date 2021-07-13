import pyspark.sql.functions as F

df = spark.read.csv('maritime.csv', header=True, multiLine=True)

df.toDF('country', 'neighbours').withColumn(
    'neighbours', 
    F.coalesce(
        F.split(F.trim('neighbours'), '\n'), 
        F.array()
    )
).coalesce(1).write.mode('overwrite').json('output')