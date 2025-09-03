<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Designation extends Model
{
    protected $table = 'designations';

    // protected $primaryKey = ''; 

    public $timestamps = false; 

    protected $fillable = [
        'name',
        'name_h',
        'status',
       
    ];
}
