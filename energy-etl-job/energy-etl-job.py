import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from pyspark.sql import functions as F
from pyspark.sql.window import Window
from datetime import datetime

# Initialize Glue context
args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

print("Starting ETL job...")

input_path = "s3://energy-forecast-raw-krishnadev/cleaned/household_power_hourly.csv"
df = spark.read.csv(input_path, header=True, inferSchema=True)

print(f"Loaded {df.count()} rows")

# Convert datetime column
df = df.withColumn("datetime", F.to_timestamp("datetime"))

# Extract time features
df = df.withColumn("hour", F.hour("datetime"))
df = df.withColumn("day_of_week", F.dayofweek("datetime"))
df = df.withColumn("day", F.dayofmonth("datetime"))
df = df.withColumn("month", F.month("datetime"))
df = df.withColumn("year", F.year("datetime"))
df = df.withColumn("is_weekend", F.when(F.col("day_of_week").isin([1, 7]), 1).otherwise(0))

# Create lag features (shifted values)
window_spec = Window.orderBy("datetime")

df = df.withColumn("power_lag_1h", F.lag("Global_active_power_mean", 1).over(window_spec))
df = df.withColumn("power_lag_24h", F.lag("Global_active_power_mean", 24).over(window_spec))
df = df.withColumn("power_lag_168h", F.lag("Global_active_power_mean", 168).over(window_spec))

# Create rolling features
window_7d = Window.orderBy("datetime").rowsBetween(-168, -1)
df = df.withColumn("power_rolling_mean_7d", F.avg("Global_active_power_mean").over(window_7d))
df = df.withColumn("power_rolling_std_7d", F.stddev("Global_active_power_mean").over(window_7d))

# Remove rows with null values (from lag operations)
df = df.na.drop()

print(f"After feature engineering: {df.count()} rows")

# Select final columns
final_df = df.select(
    "datetime",
    "hour",
    "day_of_week", 
    "day",
    "month",
    "year",
    "is_weekend",
    "Global_active_power_mean",
    "Global_active_power_max",
    "Global_active_power_min",
    "Global_active_power_std",
    "Voltage_mean",
    "power_lag_1h",
    "power_lag_24h",
    "power_lag_168h",
    "power_rolling_mean_7d",
    "power_rolling_std_7d"
)

# Rename for clarity
final_df = final_df.withColumnRenamed("Global_active_power_mean", "target_power")

# Save to S3 as Parquet
output_path = "s3://energy-forecast-processed-krishnadev/features/energy_features.parquet"
final_df.write.mode("overwrite").parquet(output_path)

print(f"Saved processed data to {output_path}")
print("ETL job completed successfully!")

job.commit()