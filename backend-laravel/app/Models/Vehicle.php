<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class Vehicle extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'brand',
        'model',
        'plate',
        'year',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Uuid::uuid7()->toString();
            }
        });
    }
}
