import pyspark.sql.functions as F

df = spark.read.csv('countries.csv')

df2 = df.select('country', 'neighbours').withColumn(
    'neighbours', 
    F.expr("""
    coalesce(
        filter(
            transform(
                split(
                    regexp_replace(neighbours, '\\\\[.*\\\\]', ''), '\\\\)'
                ), 
                x -> trim(
                    regexp_replace(
                        regexp_replace(split(x, ':')[0], '\\\\(.*$', ''),
                        '\\\\p{Z}', 
                        ' '
                    )
                )
            ),
            x -> length(x) > 1 and x not rlike '[0-9]'
        ), 
        array()
    )
    """)
).withColumn(
    'country', 
    F.expr("regexp_replace(country, '\\\\[.*\\\\]', '')")
)

df2.coalesce(1).write.mode('overwrite').json('country')
